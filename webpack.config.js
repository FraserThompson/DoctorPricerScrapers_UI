var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
  context: __dirname,

  entry: './src/index', // entry point of our app. assets/js/index.js should require other js modules and dependencies it needs

  output: {
      path: path.resolve('./dist'),
      filename: "[name].js",
  },

  plugins: [
    new BundleTracker({filename: './webpack-stats.json'}),
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1
            }
          }
        ]
      },
      {
        test: /.js?$/,
        use: 'babel-loader'
      },
      { 
        test: /\.jsx?$/, 
        exclude: /node_modules/, 
        use: 'babel-loader'
      }]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css']
  },
  externals: {
    config: JSON.stringify(require('./app_config.json')), //eslint-disable-line
  }
}