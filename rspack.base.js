const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const path = require("path");
const env = {
  mode: "usage",
  targets: ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"],
};
/** @type {import('@rspack/cli').Configuration} */
const config = {
  target: "web",
  entry: {
    index: "./src/index.ts",
  },
  resolve: {
    extensions: [".ts", "tsx", ".js", ".jsx", ".vue"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "index_bundle.js",
  },
  experiments: {
    css: true, // 此时需要关闭 `experiments.css` 以适配 `vue-loader` 内部处理逻辑
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: "builtin:swc-loader",
        /**
         * @type {import('@rspack/core').SwcLoaderOptions}
         */
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
            },
          },
          env: env,
        },
        type: "javascript/auto",
      },
      {
        test: /\.(tsx|jsx)$/,
        use: {
          loader: "builtin:swc-loader",
          /** @type {import('@rspack/core').SwcLoaderOptions} */
          options: {
            jsc: {
              parser: {
                syntax: "ecmascript",
                jsx: true,
              },
              transform: {
                react: {
                  pragma: "React.createElement",
                  pragmaFrag: "React.Fragment",
                  throwIfNamespace: true,
                  development: false,
                  useBuiltins: false,
                },
              },
            },
            env,
          },
        },
        type: "javascript/auto",
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: "vue-loader",
            options: {
              // 注意，为了绝大多数功能的可用性，请确保该选项为 `true`
              experimentalInlineMatchResource: true,
            },
          },
        ],
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: "sass-loader",
          },
        ],
        // 如果你需要将 '*.module.(sass|scss)' 视为 CSS Modules 那么将 'type' 设置为 'css/auto' 否则设置为 'css'
        type: "css/auto",
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "builtin:lightningcss-loader",
            /** @type {import('@rspack/core').LightningcssLoaderOptions} */
            options: {
              mode: env.mode,
              targets: env.targets,
            },
          },
        ],
        type: "css/auto",
      },
      {
        test: /\.png$/,
        type: "asset",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inject: "body",
      filename: "index.html",
      minify: true,
      scriptLoading: "defer",
      hash: true,
      title: "Webpack App",
      meta: {},
      chunks: ["index"],
    }),
    new VueLoaderPlugin(),
  ],
};
module.exports = config;
