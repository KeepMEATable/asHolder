import axios from 'axios';
import Router from '@/router';

export const loggedIn = localStorage.getItem(process.env.VUE_APP_API_LOCALSTORAGE_KEY);
if (null !== loggedIn) {
  const user = JSON.parse(loggedIn);
  axios.defaults.headers.common.Authorization = `Bearer ${user.token}`;
}

axios.defaults.headers.post['Content-Type'] = 'application/json';

export const Api = axios.create({
  baseURL: `${process.env.VUE_APP_API_ENTRYPOINT}/`,
  timeout: 1000,
});

Api.interceptors.response.use((response: any) => {
  return response;
}, (error: any) => {
  const {response: { status }} = error;

  if (status === 401 || status === 402) {
    Router.push('/login');
  }

  return Promise.reject(error);
});
