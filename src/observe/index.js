import { newArrayProto } from "./array"

class Observer {
  constructor(data) {
    this.data = data
    // data.__ob__ = this
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false
    })
    if (Array.isArray(data)) {
      data.__proto__  = newArrayProto

      // 重写数组的方法
      this.observeArray(data)
    } else {
      this.walk(data)
    }
  }
  walk(data) {
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
  }
  observeArray(data) {
    data.forEach(item => observe(item))
    // 数组中每一项也需要被 observe
  }
}

export function defineReactive(target, key, value) {
  observe(value) // 递归遍历所有子属性
  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get() {
      // console.log(`获取${key}属性值：${value}`)
      return value
    },
    set(newValue) {
      // console.log(`设置${key}属性值：${newValue}`)
      if (newValue === value) {
        return
      }
      observe(value)
      value = newValue
    }
  })
}

export function observe(data) {
  // console.log(data)
  if (typeof data !== 'object' || data === null) {
    return
  }

  if (data.__ob__ instanceof Observer) {
    return data.__ob__
  }
  // 判断对象是否被劫持
  return new Observer(data)
}