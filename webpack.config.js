var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, "client"),
  devtool: debug ? "inline-sourcemap" : null,
  entry: {
    react: ["react", "react-dom"],
    index: "./src/js/index.js",
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015', 'stage-0'],
        plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
      }
    }]
  },
  output: {
    path: __dirname + "/public/js/",
    filename: "[name].min.js"
  },
  plugins: debug ? [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'react',
      filename: '[name].min.js',
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'bundle',
      chunks: ['index', 'about'],
      filename: '[name].min.js',
    })
  ] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        mangle: false,
        sourcemap: false
      })
    ]
};