const webpack = require('webpack');
const config = require('../webpack.config.js');
const path = require('path');
const fs = require('fs');
const compiler = webpack(config);

compiler.run((err, stats) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(
    stats.toString({
      chunks: false,
      colors: true,
    })
  );

  const outputFile = path.join(config.output.path, config.output.filename);
  const text = fs.readFileSync(outputFile, 'utf8').toString();
  fs.writeFileSync(outputFile, '#!/usr/bin/env node\n' + text);

  console.log('==== Add successfully! ==== ');
});
