'use strict';
const path = require('path');
const webpack = require('webpack');
const pkg = require('../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, '../src'),
  entry: {
    main: ['babel-polyfill','./app.js'],
    vendor: [
      'react',
      'react-dom',
      'immutable',
      'react-redux',
      'react-router',
    ],
  },
  output: {
    path: path.resolve(__dirname, '../dist/client'),
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    publicPath: '/',
  },
  devtool: 'inline-source-map',

  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '../src')
    ],
    extensions: ['.js', '.json', '.jsx'],
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: ['source-map-loader'],
      //   exclude: [/node_modules/],
      //   enforce: 'pre'
      // },
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader'
        }],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new HtmlWebpackPlugin({
      title: 'App Starter',
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/templates/index.html'),
    }),
  ]
};
