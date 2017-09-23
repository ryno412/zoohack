const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'sass-loader'
        },
        ]
      }
    ]
  },
  devServer: {
    proxy: { // proxy URLs to backend development server
      '/api': 'https://localhost:3000',
      '/stats': 'http://localhost:3000'
    },
    port: 5000,
    host: 'localhost',
    publicPath: '/',
    contentBase: path.join(__dirname, '../src'),
    compress: true,
    historyApiFallback: true,
    hot: true,
    https: false,
    noInfo: false,
    disableHostCheck: true,
  },
})
