import Vue from 'vue';
import Vuex from 'vuex';

import { waitingLine } from './waitingLine';
import { authentication } from './authentication';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    waitingLine,
    authentication
  },
  plugins: [
    createPersistedState({
      key: 'takeMEATable-holder',
    }),
  ],
});
