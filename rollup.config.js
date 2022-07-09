import commonjs from "@rollup/plugin-commonjs"
import {nodeResolve} from "@rollup/plugin-node-resolve"
export default {
  input: "./out-tsc/index.js",
  output: {
    file: "dist/chunchunmaru.bundle.js",
    format: "iife",
    name: 'chunchunmaru'
  },
  plugins: [commonjs(), nodeResolve()]
}
