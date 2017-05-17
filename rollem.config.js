import uglify from 'rollup-plugin-uglify'
import buble from 'rollup-plugin-buble'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import ramda from 'rollup-plugin-ramda'

const d = new Date()

const banner = '// split-article - created by Lajos Mészáros <m_lajos@hotmail.com> - MIT Licence - '
  + d.getFullYear() + '-' + (d.getMonth() + 1 < 10 ? '0' : '') + (d.getMonth() + 1) + '-' + (d.getDate() < 10 ? '0' : '') + d.getDate()

export default [{
  banner: banner,
  entry: 'src/index.js',
  dest: 'dist/split-article.js',
  format: 'umd',
  moduleName: 'SplitArticle',
  sourceMap: false,
  plugins: [
    resolve({
      jsnext: true,
      main: true
    }),
    commonjs({
      namedExports : {
        'node_modules/ramda/index.js': Object.keys(require('ramda'))
      }
    }),
    ramda(),
    buble()
  ]
}, {
  entry: 'src/index.js',
  dest: 'dist/split-article.min.js',
  format: 'umd',
  moduleName: 'SplitArticle',
  sourceMap: true,
  plugins: [
    resolve({
      jsnext: true,
      main: true
    }),
    commonjs({
      namedExports : {
        'node_modules/ramda/index.js': Object.keys(require('ramda'))
      }
    }),
    ramda(),
    buble(),
    uglify({
			output: {
				preamble: banner
			}
		})
  ]
}]
