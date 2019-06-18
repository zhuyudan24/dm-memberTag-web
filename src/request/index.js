import axios from 'axios';
import { Message } from 'element-ui';
// import { getToken } from '@/'

const host = window.location.origin;

const BASEURL = host.indexOf('localhost') > -1 ? 'http://gicdev.demogic.com/gic-member-tag-web' : `${host}/gic-member-tag-web`;

const server = axios.create({
  baseURL: BASEURL,
  timeout: 10000
});

server.interceptors.request.use(
  config => {
    // 在header裡面加一些內容 例如token
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

server.interceptors.response.use(
  response => {
    const data = response.data;
    if (data.errorCode == 1) {
      return data;
    } else {
      // 根据不同的状态码来做一些操作 例如 token不合法 token过期 没有权限之类的'
      Message({
        message: data.message,
        type: 'warning',
        duration: 3000
      });
      return Promise.reject('error');
    }
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

export default server;
