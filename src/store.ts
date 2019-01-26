import Vue from 'vue';
import Vuex from 'vuex';
import Router from './router';
import Queue from '@/models/Queue';
import Api from '@/lib/Api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {

  },
  mutations: {
    addQueue(state, queue: Queue) {
      Router.push({ name: 'numberselect' });
    },
  },
  actions: {
    flash({ commit }, uid) {
      Api
        .patch(`queues/${uid}/state`, {
          state: 'wait',
        })
        .then((response: any) => {
          commit('addQueue', response);
        });
    },
  },
});
