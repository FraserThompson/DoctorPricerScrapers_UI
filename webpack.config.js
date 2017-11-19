var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
  context: __dirname,

  entry: './src/index', // entry point of our app. assets/js/index.js should require other js modules and dependencies it needs

  output: {
      path: path.resolve('./public'),
      filename: "[name].js",
  },

  plugins: [
    new BundleTracker({filename: './webpack-stats.json'}),
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
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
              importLoaders: 1,
              localIdentName: "[name]--[local]--[hash:base64:8]"
            }
          },
          "postcss-loader"
        ]
      },
      {
        test: /.js?$/,
        loader: 'babel-loader'
      },
      { 
        test: /\.jsx?$/, 
        exclude: /node_modules/, 
        loader: 'babel-loader',
        query: { presets:['es2015', 'react'] }
      }]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css']
  },
  externals: {
    config: JSON.stringify(require('./app_config.json')), //eslint-disable-line
  }
}