import axios from 'axios';

import history from 'browserHistory';
import toast from 'shared/utils/toast';
import { objectToQueryString } from 'shared/utils/url';
import { getStoredAuthToken, removeStoredAuthToken } from 'shared/utils/authToken';

import Cookies from 'js-cookie';
const cookie_value = Cookies.get('soloo_arena');
const defaults = {
  baseURL: 'http://localhost:4041/v1',
  headers: () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${cookie_value}`,
  }),
  error: {
    code: 'INTERNAL_ERROR',
    message: 'Something went wrong. Please check your internet connection or contact our support.',
    status: 503,
    data: {},
  },
};

const api = (method, url, variables) =>
  new Promise((resolve, reject) => {
    console.log(cookie_value);
    axios({
      url: `${defaults.baseURL}${url}`,
      method,
      withCredentials: true,
      headers: defaults.headers(),
      params: method === 'get' ? variables : undefined,
      data: method !== 'get' ? variables : undefined,
      paramsSerializer: objectToQueryString,
    }).then(
      response => {
        resolve(response.data);
      },
      error => {
        if (error.response) {
          if (error.response.data.error.code === 'INVALID_TOKEN') {
            removeStoredAuthToken();
            history.push('/authenticate');
          } else {
            reject(error.response.data.error);
          }
        } else {
          reject(defaults.error);
        }
      },
    );
  });

const optimisticUpdate = async (url, { updatedFields, currentFields, setLocalData }) => {
  try {
    setLocalData(updatedFields);
    await api('put', url, updatedFields);
  } catch (error) {
    setLocalData(currentFields);
    toast.error(error);
  }
};

export default {
  get: (...args) => api('get', ...args),
  post: (...args) => api('post', ...args),
  put: (...args) => api('put', ...args),
  patch: (...args) => api('patch', ...args),
  delete: (...args) => api('delete', ...args),
  optimisticUpdate,
};
