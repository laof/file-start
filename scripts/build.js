const webpack = require('webpack');
const config = require('../webpack.config.js');
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
  console.log('==== Compiled Done! ==== ');
});
