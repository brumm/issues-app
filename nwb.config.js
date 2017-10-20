const path = require('path')
const webpack = require('webpack')
const package = require('./package.json')

module.exports = {
  type: 'react-app',
  webpack: {
    extra: {
      resolve: {
        modules: [path.resolve('./src'), 'node_modules'],
        extensions: ['.scss'],
      },
      target: 'electron-renderer',
      output: {
        publicPath: ''
      }
    },
    uglify: false,
    html: {
      template: path.resolve('./src/index.html'),
      title: package.name,
    },
    rules: {
      'sass-css': {
        options: {
          modules: true,
          localIdentName: '[local]-[hash:base64:10]',
          camelCase: true,
        },
      },
    },
  },
  babel: {
    stage: 0,
  },
}
