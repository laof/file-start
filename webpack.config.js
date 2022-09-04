import webpack from 'webpack';
import { resolve } from 'path';
import manifest from './package.json' assert { type: 'json' };

export default {
  target: 'node',
  mode: 'production',
  externals: _externals(),
  entry: './main.js',
  output: {
    path: resolve(),
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
  const dependencies = manifest.dependencies;
  const externals = {};
  for (const p in dependencies) {
    externals[p] = 'commonjs ' + p;
  }
  return externals;
}
