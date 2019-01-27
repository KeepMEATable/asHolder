import Vue from 'vue';
import Vuex from 'vuex';
import Router from './router';
import Queue from '@/models/Queue';
import Api from '@/lib/Api';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    queues: []
  },
  mutations: {
    setQueues(state, queues) {
      state.queues = queues;
    },
    addQueue(state, queue: Queue) {
      state.queues.push(queue);
      Router.push({ name: 'numberselect' });
    },
  },
  actions: {
    init({commit}) {
      Api
        .get(`queues`)
        .then((response: any) => {
          commit('setQueues', response.data['hydra:member']);
        });
    },
    flash({ commit }, uid) {
      Api
        .patch(`queues/${uid}/state`, {
          state: 'wait',
        })
        .then((response: any) => {
          commit('addQueue', response);
        });
    },
    ready({ commit }, item) {
      Api
        .patch(`queues/${item.customerId}/state`, {
          state: 'ready',
        })
        .then((response: any) => {
          this.dispatch('init');
        });
    },
    reset({ commit }, item) {
      Api
        .patch(`queues/${item.customerId}/state`, {
          state: 'reset',
        })
        .then((response: any) => {
          this.dispatch('init');
        });
    },
  },
  plugins: [
    createPersistedState({
      key: 'takeMEATable-holder',
    }),
  ],
});
