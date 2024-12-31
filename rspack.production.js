const rspack = require("@rspack/core");
const { merge } = require("webpack-merge");
const baseConfig = require("./rspack.base.js");
/** @type {import('@rspack/cli').Configuration} */
const config = merge(baseConfig, {
  mode: "production",
  output: {
    clean: true, // Clean the output directory before emit.
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [rspack.CssExtractRspackPlugin.loader, "css-loader"],
        type: "javascript/auto",
      },
    ],
  },
  plugins: [new rspack.CssExtractRspackPlugin({})],
});
module.exports = config;
