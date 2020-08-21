const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const webpack = require("webpack")

module.exports = {
  publicPath: '/console',
  outputDir: 'dist',
  assetsDir: '',
  productionSourceMap: false,
  parallel: require('os').cpus().length > 1,
  runtimeCompiler: false,
  lintOnSave: true,
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  },
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['json', 'markdown', 'plaintext'],
        // publicPath: '/'
      }),
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn|zh-hk|en/),
    ]
  }
}
