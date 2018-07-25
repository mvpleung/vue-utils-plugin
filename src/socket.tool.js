/*
 * socket工具
 * @Author: liangzc 
 * @Date: 2018-05-26 10:04:03 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-07-23 12:59:51
 */
class _$SocketClient {
  /**
   * @param {String} url socket 链接
   * @param {Object} option 配置项，支持如下配置
   * {
   *    heartCheck: Boolean, 是否需要心跳检测，默认为 false,
   *    reconnect: Boolean, 是否需要断线重连，默认为 true,
   *    heartTime: Number, 心跳时间，默认 60秒,
   *    debug: Boolean 是否为 debug 模式，debug 模式会打印日志
   * }
   */
  constructor(url, option = {}) {
    if (!window.WebSocket) {
      console.warn('你的浏览器不支持websocket');
      return;
    }
    this.lockReconnect = false; //避免重复连接
    this.option = Object.assign(
      {},
      { heartCheck: false, reconnect: true, heartTime: 60000 },
      option || {}
    );
    //心跳配置
    this.timeoutObj = null;
    this.serverTimeoutObj = null;
    this.createSocket(url);
  }

  /**
   * 创建 WebSocket
   * @param {String} url
   */
  createSocket(url) {
    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = event => {
        this.option.debug && console.log('websocket 连接打开', event);
        this.onopen && this.onopen(event, this.ws);
        //心跳检测重置
        this.option.heartCheck === true && this.startHeartCheck();
      };

      this.ws.onmessage = event => {
        this.option.debug && console.log('websocket message', event);
        this.onmessage && this.onmessage(event, this.ws);
        //如果获取到消息，心跳检测重置
        //拿到任何消息都说明当前连接是正常的
        this.option.heartCheck === true && this.startHeartCheck();
      };

      this.ws.onclose = event => {
        this.option.debug && console.log('websocket 连接关闭', event);
        this.onclose && this.onclose(event, this.ws);
        this.option.reconnect === true && this.reconnect(url);
      };

      this.ws.onerror = event => {
        this.option.debug && console.error('websocket error', event);
        this.onerror && this.onerror(event, this.ws);
        this.option.reconnect === true && this.reconnect(url);
      };
    } catch (error) {
      this.option.debug && console.error(error);
      this.option.reconnect === true && this.reconnect(url);
    }
  }

  /**
   * 发送消息
   */
  send() {
    if (this.ws) {
      this.ws.send(...arguments);
    }
  }

  readyState() {
    return this.ws ? this.ws.readyState : 0;
  }

  bufferedAmount() {
    return this.ws ? this.ws.bufferedAmount : 0;
  }

  /**
   * 关闭Socket
   */
  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * 重建链接
   */
  reconnect(url) {
    if (this.lockReconnect || !this.ws) return;
    this.lockReconnect = true; //加重新链接锁，避免重复请求
    //没连接上会一直重连，设置延迟避免请求过多
    setTimeout(() => {
      this.option.debug && console.log('reconnect....');
      this.createSocket(url);
      this.lockReconnect = false;
    }, 2000);
  }

  /**
   * 心跳检测
   */
  startHeartCheck() {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    this.ws &&
      (this.timeoutObj = setTimeout(() => {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        //onmessage拿到返回的心跳就说明连接正常
        if (this.ws) {
          this.ws.send('HeartBeat');
          this.serverTimeoutObj = setTimeout(() => {
            //如果超过一定时间还没重置，说明后端主动断开了
            this.ws && this.ws.close(); //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
          }, this.option.heartTime);
        }
      }, this.option.heartTime));
  }
}

let SocketTools = (function() {
  /**
   * 创建webSocket
   * @param {String} url
   * @param {Object} option 配置项，支持如下配置
   * {
   *    heartCheck: Boolean, 是否需要心跳检测，默认为 false,
   *    reconnect: Boolean, 是否需要断线重连，默认为 true,
   *    heartTime: Number, 心跳时间，默认 60秒,
   *    callbacks: Object,  onopen(event), onclose(event), onerror(event), onmessage(event),
   *    debug: Boolean 是否为 debug 模式，debug 模式会打印日志
   * }
   */
  function createWebSocket(url, option = {}) {
    if (!window.WebSocket) {
      console.warn('你的浏览器不支持websocket');
      return;
    }
    let callbacks = (option || {}).callbacks || {};
    let socketClient = new _$SocketClient(url, option);
    for (let key in callbacks) {
      socketClient[key] = callbacks[key];
    }
    return socketClient;
  }

  return {
    createWebSocket: createWebSocket //创建webScoket
  };
})();

typeof exports === 'object' && typeof module !== 'undefined' ?
  module.exports = SocketTools :
  window.SocketTools = SocketTools;
