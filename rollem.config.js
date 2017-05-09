import uglify from 'rollup-plugin-uglify'
import buble from 'rollup-plugin-buble'

export default [{
  entry: 'src/index.js',
  dest: 'dist/split-article.js',
  format: 'umd',
  moduleName: 'SplitArticle',
  sourceMap: true,
  plugins: [
    buble(),
    uglify()
  ]
}]
