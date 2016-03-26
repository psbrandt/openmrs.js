/* eslint-disable func-names */
'use strict';
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const env = require('yargs').argv.mode;
const target = require('yargs').argv.target;
const UglifyPlugin = webpack.optimize.UglifyJsPlugin;

const libraryName = 'OpenMRS';
const fileName = 'openmrs';

const plugins = [];
const nodeModules = {};

let outputFile;

/** Don't bundle dependencies for node module */
if (target === 'web') {
  outputFile = `${fileName}.bundle`;
} else if (target === 'node') {
  outputFile = fileName;

  fs.readdirSync('node_modules')
    .filter(x =>
      ['.bin'].indexOf(x) === -1
    )
    .forEach(mod => {
      nodeModules[mod] = `commonjs ${mod}`;
    });
}

/** Minify for production */
if (env === 'production') {
  plugins.push(new UglifyPlugin({
    output: {
      comments: false,
    },
    minimize: true,
  }));
  outputFile = `${outputFile}.min.js`;
} else if (env === 'dev') {
  outputFile = `${outputFile}.js`;
}

/** Inject version number */
plugins.push(new webpack.DefinePlugin({
  __OPENMRS_JS_VERSION__: JSON.stringify(require('./package.json').version),
}));

const config = {
  entry: `${__dirname}/src/openmrs.js`,
  devtool: 'source-map',
  target,
  output: {
    path: `${__dirname}/lib`,
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    preLoaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
    }],
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js'],
  },
  plugins,
  externals: nodeModules,
};

module.exports = config;
