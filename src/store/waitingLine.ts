import Router from '@/router';
import WaitingLine from '@/models/WaitingLine';
import { Api } from '@/lib/Api';

const baseUrl = `${process.env.VUE_APP_MERCURE_HUB_ENTRYPOINT}`;
const baseTopic = `${process.env.VUE_APP_API_ENTRYPOINT}/waiting_lines/`;
const url = new URL(baseUrl);

export const waitingLine = {
  namespaced: true,
  state: {
    waitingLines: []
  },
  mutations: {
    addWaitingLine(state, waitingLine: WaitingLine) {
      const alreadyExists = state.waitingLines.find(exist => exist.customerId == waitingLine.customerId);

      if (alreadyExists == undefined) {
        state.waitingLines.push(waitingLine);
      }
    },
    updateWaitingLine(state, waitingLine: WaitingLine) {
      if (!waitingLine.waiting) {
        state.waitingLines = state.waitingLines.filter(exist => exist.customerId != waitingLine.customerId);
        return;
      }

      const alreadyExists = state.waitingLines.find(exist => exist.customerId == waitingLine.customerId);

      if (alreadyExists == undefined) {
        state.waitingLines.push(waitingLine);
      }
    },
    resetWaitingLine(state) {
      state.waitingLines = [];
    }
  },
  actions: {
    init({commit}) {
      Api
        .get(`waiting_lines`)
        .then(({data}: any) => {
          commit('resetWaitingLine');

          url.searchParams.append('topic', `${baseTopic}{id}`);

          const es = new EventSource(url.toString());
          es.onmessage = ({data}: any) => {
            const waitingLine = JSON.parse(data);
            commit('updateWaitingLine', waitingLine);
          };

          if (0 === data['hydra:member'].length) {
            return;
          }

          data['hydra:member'].forEach(function(waitingLine: WaitingLine) {
            commit('addWaitingLine', waitingLine);
          });
        });
    },
    flash({ commit }, uid) {
      Api
        .patch(`waiting_lines/${uid}/state`, {
          state: 'wait',
        })
        .then(({data}: any) => {
          commit('addWaitingLine', data);

          const es = new EventSource(`${baseUrl}?topic=${baseTopic}${data.customerId}`);
          es.onmessage = ({data}) => {
            const waitingLine = JSON.parse(data);
            commit('updateWaitingLine', waitingLine);
          };

          Router.push({ name: 'numberselect' });
        }).catch(error => {
          // @todo display error.
          Router.push({ name: 'numberselect' });
      });
    },
    ready({ commit }, item) {
      Api
        .patch(`waiting_lines/${item.customerId}/state`, {
          state: 'ready',
        })
        .then((response: any) => {
          commit('updateWaitingLine', response);
        });
    },
    reset({ commit }, item) {
      Api
        .patch(`waiting_lines/${item.customerId}/state`, {
          state: 'reset',
        })
        .then((response: any) => {
          commit('updateWaitingLine', response);
        });
    },
  }
};
