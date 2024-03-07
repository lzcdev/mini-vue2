import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: './src/index.js',
  output: {
    file: './dist/vue.js',
    name: 'Vue',
    format: 'umd', // 兼容 AMD 和 CommonJS 模块规范
    sourcemap: true,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve()
  ]
}