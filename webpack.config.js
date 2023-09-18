/**
 * File: /webpack.config.js
 * Project: app
 * File Created: 20-10-2022 05:05:21
 * Author: Clay Risser
 * -----
 * Last Modified: 25-10-2022 15:12:23
 * Modified By: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2022
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const nodeExternals = require('webpack-node-externals');
const path = require('path');
const pkg = require('./package.json');

module.exports = {
  mode: 'development',
  target: 'node',
  devtool: 'eval-source-map',
  entry: {
    main: './src/main.ts',
  },
  externalsPresets: {
    node: true,
  },
  externals: [
    nodeExternals({
      allowlist: pkg.transpileModules,
    }),
  ],
  resolve: {
    extensions: ['.cjs', '.js', '.json', '.jsx', '.mjs', '.ts', '.tsx'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.(([mc]?js)|([jt]sx?))$/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
          },
        },
      },
    ],
  },
};
