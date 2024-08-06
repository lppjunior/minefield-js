const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  entry: {
    minefield: './src'
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Minefield JS',
      favicon: 'src-example/favicon.png',
      template: 'src-example/index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src-example/styles.css', to: '' },
        { from: 'src-example/main.js', to: '' },
        { from: 'src-example/minefield-client.js', to: '' }
      ]
    })
  ],

  // webpack-dev-server configurations
  devServer: {
    compress: true,
    contentBase: path.join(__dirname, 'dist'),
    open: true,
    port: 9000
  }
}
