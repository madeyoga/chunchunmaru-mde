import commonjs from "@rollup/plugin-commonjs"
import {nodeResolve} from "@rollup/plugin-node-resolve"
export default {
  input: "./out-tsc/index.js",
  output: {
    file: "dist/chunmde.bundle.js",
    format: "iife",
    name: 'chunmde'
  },
  plugins: [commonjs(), nodeResolve()]
}
