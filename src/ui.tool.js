let UiTools = (function() {
  /**
   * 隐藏软键盘
   * @param {Element} el 需要隐藏软键盘的Dom节点或父节点（选填）
   */
  function hideKeyboard(el) {
    document.activeElement.blur();
    if (el) {
      el.blur();
      el.querySelector('input').blur();
    } else {
      document.querySelector('input').blur();
    }
  }

  /**
   * 切换控件显示隐藏
   * @param {Element} el 节点
   * @param {Element} arrow 箭头
   * @param {Array} deg 方向
   */
  function toggle(el, arrow, deg) {
    if (deg && !Array.isArray(deg)) return;
    return new Promise((resolve, reject) => {
      el = Array.isArray(el) ? el : [el];
      el.forEach(dom => {
        if (dom.classList.contains('hide')) {
          dom.classList.remove('hide');
          if (arrow) {
            arrow = Array.isArray(arrow) ? arrow : [arrow];
            arrow.forEach(arr => {
              arr.style.transform = `rotate(${deg[0]}deg)`;
            });
          }
          resolve(true);
        } else {
          dom.classList.add('hide');
          if (arrow) {
            arrow = Array.isArray(arrow) ? arrow : [arrow];
            arrow.forEach(arr => {
              arr.style.transform = `rotate(${deg[1]}deg)`;
            });
          }
          resolve(false);
        }
      });
    });
  }

  /**
   * 解决弹层滚动穿透
   */
  let modalHelper = (function(bodyCls) {
    let el,
      scrollTop,
      elCache = {};
    return {
      /**
       * 初始化
       * @param {String} selector 需要控制滚动的选择器
       */
      init(selector) {
        el = document.querySelector(selector);
        elCache[selector] = el;
        scrollTop = 0;
        return el;
      },
      /**
       * 弹层打开之后调用
       * @param {String} selector 需要控制滚动的选择器
       */
      afterOpen(selector) {
        el = selector ? elCache[selector] || this.init(selector) : el;
        scrollTop = document.scrollingElement.scrollTop;
        el.classList.add(bodyCls);
        el.style.top = -scrollTop + 'px';
      },
      /**
       * 弹层关闭之前调用
       * @param {String} selector 需要控制滚动的选择器
       */
      beforeClose(selector) {
        el = selector ?
          elCache[selector] ||
            (elCache[selector] = document.querySelector(selector)) :
          el;
        el.classList.remove(bodyCls);
        // scrollTop lost after set position:fixed, restore it back.
        document.scrollingElement.scrollTop = scrollTop;
        scrollTop = 0;
      }
    };
  })('modal-open-helper');

  /**
   * 处理滚动穿透
   * @param {String} layerNode 需要滚动的节点
   */
  let bubbleScroll = function(layerNode) {
    if (!document.querySelector(layerNode)) return;

    this.popupLayer = document.querySelector(layerNode);
    this.startX = 0;
    this.startY = 0;

    this.popupLayer.addEventListener(
      'touchstart',
      function(e) {
        this.startX = e.changedTouches[0].pageX;
        this.startY = e.changedTouches[0].pageY;
      },
      false
    );

    // 仿innerScroll方法
    this.popupLayer.addEventListener(
      'touchmove',
      function(e) {
        e.stopPropagation();

        var deltaX = e.changedTouches[0].pageX - this.startX;
        var deltaY = e.changedTouches[0].pageY - this.startY;

        // 只能纵向滚
        if (Math.abs(deltaY) < Math.abs(deltaX)) {
          e.preventDefault();
          return false;
        }

        if (this.offsetHeight + this.scrollTop >= this.scrollHeight) {
          if (deltaY < 0) {
            e.preventDefault();
            return false;
          }
        }
        if (this.scrollTop === 0) {
          if (deltaY > 0) {
            e.preventDefault();
            return false;
          }
        }
      },
      false
    );
  };

  return {
    hideKeyboard: hideKeyboard, //隐藏软键盘
    toggle: toggle, //切换控件显示隐藏
    modalHelper: modalHelper, //解决弹窗滚动穿透(父层处理)
    bubbleScroll: bubbleScroll //处理弹层滚动穿透(弹出层处理)
  };
})();

typeof exports === 'object' && typeof module !== 'undefined' ?
  module.exports = UiTools :
  window.UiTools = UiTools;
