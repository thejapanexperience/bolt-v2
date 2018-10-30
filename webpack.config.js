var path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: path.resolve(__dirname, './lib/index.js'),
  output: {
    path: path.resolve(__dirname, '.'),
    filename: 'production/index.js',
    library: '',
    libraryTarget: 'commonjs',
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.yml$/,
        use: 'js-yaml-loader',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/react'],
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      'bolt-bede-casino-v2-config': path.resolve(__dirname, '../bolt-bede-casino-v2/src/config'),
    },
  },
};
