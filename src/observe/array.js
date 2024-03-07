// 重写数组中的部分方法

let oldArrayProto = Array.prototype;

export let newArrayProto = Object.create(oldArrayProto)

let methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice'
]
// concat,slice不会改变原数组

methods.forEach(method => {
  newArrayProto[method] = function(...args) {
    // 调用原来的方法
    const result = oldArrayProto[method].call(this, ...args)
    // 调用拦截函数
    console.log(`调用了${method}方法`, method)
    let inserted
    switch(method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break  
    }
    if (inserted) observerArray(inserted)
    return result
  }
})
