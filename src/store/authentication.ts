import {Api, loggedIn} from '@/lib/Api';
import axios from 'axios';
import Router from '@/router';

const user = null !== loggedIn ? JSON.parse(loggedIn) : null;

const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: {}, user: null };

export const authentication = {
  namespaced: true,
  state: initialState,
  mutations: {

  },
  actions: {
    login ({commit}, {name, password}) {

      return Api.post(`login_check`, {
        username: name,
        password: password,
      }).then(({data}: any) => {

        axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
        localStorage.setItem(process.env.VUE_APP_API_LOCALSTORAGE_KEY, JSON.stringify(data));

        Router.push('numberselect');
      });
    }
  }
};
