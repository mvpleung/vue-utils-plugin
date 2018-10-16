/*
 * socket工具
 * @Author: liangzc 
 * @Date: 2018-05-26 10:04:03 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-09-27 13:49:49
 */
class _$SocketClient {
  /**
   * @param {String} url socket 链接
   * @param {Object} option 配置项，支持如下配置
   * {
   *    heartCheck: Boolean, 是否需要心跳检测，默认为 false,
   *    reconnect: Boolean, 是否需要断线重连，默认为 true,
   *    heartTime: Number, 心跳时间，默认 60秒,
   *    timeout: Number, 超时时间，默认15分钟,
   *    reDelay: Number, 重连延迟间隔，默认为30秒,
   *    debug: Boolean 是否为 debug 模式，debug 模式会打印日志
   * }
   */
  constructor(url, option = {}) {
    if (!window.WebSocket) {
      console.warn('你的浏览器不支持websocket');
      return;
    }
    option.url = url;
    this.reset(option);
    this.resetTimeOut();
    this.createSocket(url);
  }

  /**
   * 创建 WebSocket
   * @param {String} url
   */
  createSocket(url) {
    if (!this.option.url || this.option.url === '' || this.option.url === null)
      return;
    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = event => {
        this.option.debug && console.log('websocket 连接打开', event);
        this.onopen && this.onopen(event, this.ws);
        this.trigger('open', event);
        //心跳检测重置
        this.startHeartCheck();
        clearTimeout(this.timeoutObj);
      };

      this.ws.onmessage = event => {
        this.option.debug && console.log('websocket message', event);
        this.onmessage && this.onmessage(event, this.ws);
        this.trigger('message', event);
        //如果获取到消息，心跳检测重置
        //拿到任何消息都说明当前连接是正常的
        this.startHeartCheck();
        clearTimeout(this.timeoutObj);
      };

      this.ws.onclose = event => {
        this.option.debug && console.log('websocket 连接关闭', event);
        this.onclose && this.onclose(event, this.ws);
        this.trigger('close', event);
        this.reconnect(url);
      };

      this.ws.onerror = event => {
        this.option.debug && console.error('websocket error', event);
        this.onerror && this.onerror(event, this.ws);
        this.trigger('error', event);
        this.reconnect(url);
      };
    } catch (error) {
      this.option.debug && console.error(error);
      this.reconnect(url);
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
   * 重新打开 Socket
   */
  reOpen() {
    this.reset();
    this.resetTimeOut();
    this.createSocket(this.option.url);
  }

  /**
   * 关闭Socket
   */
  close() {
    this.reset({ reconnect: false });
  }

  /**
   * 重置
   *
   * @param {Object} option 配置项
   */
  reset(option) {
    this.lockReconnect = false; //避免重复连接
    this.option = Object.assign(
      {},
      {
        heartCheck: false,
        reconnect: true,
        heartTime: 60000,
        reDelay: 30000,
        timeout: 900000
      },
      option || {}
    );
    //心跳配置
    clearTimeout(this.heartCheckObj);
    clearTimeout(this.serverTimeoutObj);
    clearTimeout(this.timeoutObj);
    this.heartCheckObj = null;
    this.serverTimeoutObj = null;
    this.timeoutObj = null;
    this.eventPools = {};
    if (this.ws) {
      try {
        this.ws.onerror = null;
        this.ws.onclose = null;
        this.ws.close();
      } catch (error) {}
      this.ws = null;
    }
  }

  /**
   * 重置超时Timer
   */
  resetTimeOut() {
    clearTimeout(this.timeoutObj);
    if (
      this.option.reconnect === true &&
      this.option.url &&
      this.option.url !== '' &&
      this.option.url !== null
    ) {
      this.timeoutObj = setTimeout(() => {
        console.warn('socket timeout!');
        this.close();
      }, this.option.timeout);
    }
  }

  /**
   * 重建链接
   */
  reconnect(url) {
    if (
      this.option.reconnect !== true ||
      this.lockReconnect ||
      !this.ws ||
      this.timeoutObj === undefined ||
      this.timeoutObj === null
    )
      return;
    this.lockReconnect = true; //加重新链接锁，避免重复请求
    //没连接上会一直重连，设置延迟避免请求过多
    setTimeout(() => {
      this.option.debug && console.log('reconnect....');
      this.createSocket(url);
      this.lockReconnect = false;
    }, this.option.reDelay);
  }

  /**
   * 心跳检测
   */
  startHeartCheck() {
    if (this.option.heartCheck !== true) return;
    clearTimeout(this.heartCheckObj);
    clearTimeout(this.serverTimeoutObj);
    this.ws &&
      (this.heartCheckObj = setTimeout(() => {
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

  /**
   * 触发事件
   */
  trigger(name, event, socket = this.ws) {
    let events = this.eventPools[name];
    if (events && Array.isArray(events) && events.length) {
      events.forEach(
        listener =>
          listener.callback &&
          listener.callback.call(listener.context, event, socket)
      );
    }
  }

  /**
   * 事件监听
   * @param {String} event 事件名称
   * @param {Function} func 绑定的事件
   * @param {Object} context 需要绑定的上下文，默认为 null
   */
  on(event, func, context = null) {
    if (event && typeof func === 'function') {
      let eventName = event.indexOf('on') === 0 ? event.substring(2) : event;
      let listeners = this.eventPools[eventName] || [];
      listeners.push({ callback: func, context: context });
      this.eventPools[eventName] = listeners;
      return true;
    }
    return false;
  }

  /**
   * 取消事件监听
   * @param {String} event 事件名称
   * @param {Function} func 取消绑定的事件
   * @param {Object} context 需要取消绑定的上下文，默认为 null
   */
  off(event, func, context = null) {
    if (event && typeof func === 'function') {
      let eventName = event.indexOf('on') === 0 ? event.substring(2) : event;
      let listeners = this.eventPools[eventName],
        index;
      if (listeners && Array.isArray(listeners) && listeners.length) {
        index = listeners.reduce((i, listener, index) => {
          return typeof listener.callback === 'function' &&
            listener.callback === func &&
            listener.context === context ?
            (i = index) :
            i;
        }, -1);

        if (index > -1) {
          listeners.splice(index, 1);
          this.eventPools[eventName] = listeners;
          return true;
        }
      }
    }
    return false;
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
   *    timeout: Number, 超时时间，默认15分钟,
   *    reDelay: Number, 重连延迟间隔，默认为30秒,
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
