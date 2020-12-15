const path = require('path');

module.exports = {
  target: 'node',
  externals: _externals(),
  entry: './index.js',
  output: {
    path: __dirname,
    filename: 'main.js',
  },
  optimization: {
    minimize: false,
  },
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
