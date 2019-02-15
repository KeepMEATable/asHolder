import Vue from 'vue';
import Vuex from 'vuex';
import Router from './router';
import Queue from '@/models/Queue';
import Api from '@/lib/Api';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const baseUrl = `${process.env.VUE_APP_MERCURE_HUB_ENTRYPOINT}`;
const baseTopic = `${process.env.VUE_APP_API_ENTRYPOINT}/queues/`;
const url = new URL(baseUrl);

export default new Vuex.Store({
  state: {
    queues: []
  },
  mutations: {
    addQueue(state, queue: Queue) {
      state.queues.push(queue);
    },
    updateQueue(state, queue: Queue) {
      if (!queue.waiting) {
        state.queues = state.queues.filter(exist => exist.customerId != queue.customerId);
        return;
      }

      const alreadyExists = state.queues.find(exist => exist.customerId == queue.customerId);

      if (alreadyExists == undefined) {
        state.queues.push(queue);
      }
    },
    resetQueue(state) {
      state.queues = [];
    }
  },
  actions: {
    init({commit}) {
      Api
        .get(`queues`)
        .then(({data}: any) => {
          commit('resetQueue');

          if (0 === data['hydra:member'].length) {
            return;
          }

          data['hydra:member'].forEach(function(queue: Queue) {
            commit('addQueue', queue);
            url.searchParams.append('topic', `${baseTopic}${queue.customerId}`);
          });

          const es = new EventSource(url);
          es.onmessage = ({data}: any) => {
            const queue = JSON.parse(data);
            commit('updateQueue', queue);
          };
        });
    },
    flash({ commit }, uid) {
      Api
        .patch(`queues/${uid}/state`, {
          state: 'wait',
        })
        .then(({data}: any) => {
          commit('addQueue', data);

          const es = new EventSource(`${baseUrl}?topic=${baseTopic}${data.customerId}`);
          es.onmessage = ({data}) => {
            const queue = JSON.parse(data);
            commit('updateQueue', queue);
          };

          Router.push({ name: 'numberselect' });
        }).catch(error => {
          // @todo display error.
          Router.push({ name: 'numberselect' });
      });
    },
    ready({ commit }, item) {
      Api
        .patch(`queues/${item.customerId}/state`, {
          state: 'ready',
        })
        .then((response: any) => {
          commit('updateQueue', response);
        });
    },
    reset({ commit }, item) {
      Api
        .patch(`queues/${item.customerId}/state`, {
          state: 'reset',
        })
        .then((response: any) => {
          commit('updateQueue', response);
        });
    },
  },
  plugins: [
    createPersistedState({
      key: 'takeMEATable-holder',
    }),
  ],
});
