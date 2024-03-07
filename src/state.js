import { observe } from "./observe/index";

export function initState(vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
}

function initData(vm) {
  let data = vm.$options.data;
  data = typeof data === 'function' ? data.call(vm) : data;

  vm._data = data;
  // 数据劫持 defineProperty / Proxy
  observe(data)

  for (const key in data) {
    proxy(vm, '_data', key)
  }
}

function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    set(newValue) {
      vm[target][key] = newValue 
    },
    get() {
      return vm[target][key]
    }
  })
}