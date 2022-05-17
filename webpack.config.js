const webpack = require('webpack');

var config = {
  target: 'node',
  mode: 'production',
  externals: _externals(),
  entry: './main.js',
  output: {
    path: __dirname,
    filename: 'index.js',
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.BannerPlugin({
      entryOnly: true,
      banner: '#!/usr/bin/env node',
      raw: true,
    }),
  ],
};

function _externals() {
  const manifest = require('./package.json');
  const dependencies = manifest.dependencies;
  const externals = {};
  for (const p in dependencies) {
    externals[p] = 'commonjs ' + p;
  }
  return externals;
}

module.exports = config;
