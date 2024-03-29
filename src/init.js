import { initState } from './state'
import { compileToFunction } from './compiler'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;
    // 初始化状态
    initState(vm);

    if (options.el) {
      vm.$mount(options.el);
    }
  }
  Vue.prototype.$mount = function(el) {
    const vm = this;
    el = document.querySelector(el)
    let ops = vm.$options
    if (!ops.render) {
      let template;
      if (!ops.tempalte && el) {
        template = el.outerHTML
      } else {
        if (el) {
          template = ops.template
        }
      }

      if (template) {
        const render = compileToFunction(template)
        ops.render = render
      }
    }

    ops.render

  }
}
