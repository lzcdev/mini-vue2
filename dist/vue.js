(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : String(i);
  }
  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  // 重写数组中的部分方法

  var oldArrayProto = Array.prototype;
  var newArrayProto = Object.create(oldArrayProto);
  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
  // concat,slice不会改变原数组

  methods.forEach(function (method) {
    newArrayProto[method] = function () {
      var _oldArrayProto$method;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      // 调用原来的方法
      var result = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args));
      // 调用拦截函数
      console.log("\u8C03\u7528\u4E86".concat(method, "\u65B9\u6CD5"), method);
      var inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.slice(2);
          break;
      }
      if (inserted) observerArray(inserted);
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);
      this.data = data;
      // data.__ob__ = this
      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false
      });
      if (Array.isArray(data)) {
        data.__proto__ = newArrayProto;

        // 重写数组的方法
        this.observeArray(data);
      } else {
        this.walk(data);
      }
    }
    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          return observe(item);
        });
        // 数组中每一项也需要被 observe
      }
    }]);
    return Observer;
  }();
  function defineReactive(target, key, value) {
    observe(value); // 递归遍历所有子属性
    Object.defineProperty(target, key, {
      enumerable: true,
      configurable: true,
      get: function get() {
        // console.log(`获取${key}属性值：${value}`)
        return value;
      },
      set: function set(newValue) {
        // console.log(`设置${key}属性值：${newValue}`)
        if (newValue === value) {
          return;
        }
        observe(value);
        value = newValue;
      }
    });
  }
  function observe(data) {
    // console.log(data)
    if (_typeof(data) !== 'object' || data === null) {
      return;
    }
    if (data.__ob__ instanceof Observer) {
      return data.__ob__;
    }
    // 判断对象是否被劫持
    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options;
    if (opts.data) {
      initData(vm);
    }
  }
  function initData(vm) {
    var data = vm.$options.data;
    data = typeof data === 'function' ? data.call(vm) : data;
    vm._data = data;
    // 数据劫持 defineProperty / Proxy
    observe(data);
    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }
  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      set: function set(newValue) {
        vm[target][key] = newValue;
      },
      get: function get() {
        return vm[target][key];
      }
    });
  }

  function compileToFunction(template) {
    console.log(1, template);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      // 初始化状态
      initState(vm);
      if (options.el) {
        vm.$mount(options.el);
      }
    };
    Vue.prototype.$mount = function (el) {
      var vm = this;
      el = document.querySelector(el);
      var ops = vm.$options;
      if (!ops.render) {
        var template;
        if (!ops.tempalte && el) {
          template = el.outerHTML;
        } else {
          if (el) {
            template = ops.template;
          }
        }
        if (template) {
          var render = compileToFunction(template);
          ops.render = render;
        }
      }
      ops.render;
    };
  }

  function Vue(options) {
    this._init(options); // 初始化
  }
  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
