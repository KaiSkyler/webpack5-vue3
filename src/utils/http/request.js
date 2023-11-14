/*
 * @Description: axios
 * @Author: cwk
 * @Date: 2021-12-09 21:19:39
 */
import { ElMessage } from "element-plus";

import axios from "axios";
import * as EventEmitter from 'events';

// 封装axios请求
const http = axios.create({
  baseURL: '', // 基础URL
  timeout: 10000 // 请求超时时间
});

class Request extends EventEmitter {
  constructor() {
    super();
    this.interceptors();
  }
  interceptors() {
    // 请求拦截器
    http.interceptors.request.use(
      // 发送请求之前
      config => {
        // 头部设置 签名
        config.headers.sign = '' // 略，根据后端协商自行完善
        // 头部设置 token
        config.headers.token = '' // 略，根据后端协商自行完善
        return config;
      },
      error => {
        // 请求错误
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    http.interceptors.response.use(
      response => {
        const code = response.status;
        // 根据自己的业务代码进行响应拦截
        if ((code >= 200 && code < 300) || code === 304) {
          const res = response.data
          // 成功的事件回调，可以略，可以全局的去做一些业务处理
          this.emit("Success", res);
          return Promise.resolve(res);
        } else {
          console.log(response)
          // 响应错误逻辑处理 5xx 4xx 等等
          this.emit("Error", response);
          return Promise.reject(response);
        }
      },
      error => {
        // 响应错误逻辑处理
        console.log(error);
        // 接口异常了，全局的去针对业务做一些配置处理，不需要可以去掉
        this.emit("Error");
        return Promise.reject(error);
      }
    );
  }

  get(url, params) {
    return http({
      method: 'get',
      url,
      params
    });
  }
  post(url, data) {
    return http({
      method: 'post',
      url,
      data
    });
  }
  delete(url, data) {
    return http({
      method: 'delete',
      url,
      data
    });
  }
  put(url, data) {
    return http({
      method: 'put',
      url,
      data
    });
  }
  patch(url, data) {
    return http({
      method: 'patch',
      url,
      data
    });
  }
}


const dialogMessage = (message) => {
  if (!message) {
    console.error('empty message')
    return
  }
  ElMessage.error(message)
}

let request = new Request();

request.on('Success', function(data) {
  console.log('Success:', data );
});

request.on('Error', function(data) {
  console.log('Error:', data );
});

export default request;

