module.exports = (function() {

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
                            arr.style.transform = `rotate(${deg[0]}deg)`
                        })
                    }
                    resolve(true);
                } else {
                    dom.classList.add('hide');
                    if (arrow) {
                        arrow = Array.isArray(arrow) ? arrow : [arrow];
                        arrow.forEach(arr => {
                            arr.style.transform = `rotate(${deg[1]}deg)`
                        })
                    }
                    resolve(false);
                }
            });
        })
    }

    /**
     * 解决弹层滚动穿透
     */
    let modalHelper = (function(bodyCls) {
        let el, scrollTop, elCache = {};
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
            afterOpen: function(selector) {
                el = selector ? (elCache[selector] || this.init(selector)) : el;
                scrollTop = document.scrollingElement.scrollTop;
                el.classList.add(bodyCls);
                el.style.top = -scrollTop + 'px';
            },
            /**
             * 弹层关闭之前调用
             * @param {String} selector 需要控制滚动的选择器
             */
            beforeClose: function(selector) {
                el = selector ? (elCache[selector] || (elCache[selector] = document.querySelector(selector))) : el;
                el.classList.remove(bodyCls);
                // scrollTop lost after set position:fixed, restore it back.
                document.scrollingElement.scrollTop = scrollTop;
                scrollTop = 0;
            }
        };
    })('modal-open-helper');

    return {
        toggle: toggle, //切换控件显示隐藏
        modalHelper: modalHelper //解决弹窗滚动穿透
    }
})();