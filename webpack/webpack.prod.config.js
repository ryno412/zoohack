const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');


const extractSass = new ExtractTextPlugin({
  filename: '[name][hash].min.css'
});

module.exports = merge(baseConfig, {
  output: {
    path: path.resolve(__dirname, '../dist/client'),
    filename: '[name][hash].min.js',
    sourceMapFilename: '[name][hash].map',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
      test: /\.scss$/,
      use: extractSass.extract({
        use: [{
          loader: 'css-loader',
          options: {
            minimize: true || {/* CSSNano Options */}
          }
        }, {
          loader: 'sass-loader',
        }]
      })
    }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../'),
    }),
    extractSass,
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
    new CopyWebpackPlugin([
        { from: '../src/assets', to: path.resolve(__dirname, '../dist/client/assets'), },
      ]
    ),
  ]
});


