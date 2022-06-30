var path = require("path");
var webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
var BundleTracker = require("webpack-bundle-tracker");

module.exports = (env, argv) => {
  return {
    context: __dirname,

    entry: {
      app: "./app/src/index.jsx",
    },

    output: {
      path: path.join(__dirname, "dist"),
      filename: "[name].[chunkhash].bundle.js",
    },

    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "html-loader!./app/index.html",
      }),
      new BundleTracker({ filename: "./webpack-stats.json" }),
    ],

    optimization:
      argv.mode === "production"
        ? {
            splitChunks: {
              chunks: "all",
            },
            minimize: true,
            minimizer: [
              new TerserPlugin({
                test: /\.js(\?.*)?$/i,
              }),
            ],
          }
        : {},

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
              },
            },
          ],
        },
        {
          test: /.js?$/,
          use: "babel-loader",
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: "babel-loader",
        },
        {
          test: [/\.jpg$/, /\.png$/, /\.gif$/],
          type: "asset/resource",
        },
        {
          test: /\.(txt|ico)$/,
          type: "asset/resource",
          generator: {
            filename: "[name][ext]",
          },
        },
        {
          test: /CNAME$/,
          type: "asset/resource",
          generator: {
            filename: "[name]",
          },
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx", ".css"],
      modules: [
        "node_modules", // The default
        "src",
      ],
    },
    externals: {
      config: JSON.stringify(require("./app_config.json")), //eslint-disable-line
    },
  };
};
