const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'projects/game/src/index.jsx'),
  output: {
    filename: 'minefield.min.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'projects/game/src'),
        use: {
          loader: 'babel-loader',
          options: {
            rootMode: 'upward'
          }
        }
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Campo Minado Smart',
      template: path.resolve(__dirname, 'projects/game/public/index.html')
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'projects/game/src/styles.css'),
          to: 'styles.css'
        }
      ]
    })
  ],

  // webpack-dev-server configurations
  devServer: {
    compress: true,
    static: {
      directory: path.join(__dirname, 'dist')
    },
    open: true,
    port: 9000
  }
}
