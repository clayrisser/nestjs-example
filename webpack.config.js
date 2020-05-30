const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');

module.exports = {
  entry: ['webpack/hot/poll?100', './src/main.ts'],
  watch: true,
  target: 'node',
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?100']
    })
  ],
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  mode: 'development',
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new StartServerPlugin({ name: 'server.js' })
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.js'
  },
  node: {
    __filename: true,
    __dirname: true
  }
};
