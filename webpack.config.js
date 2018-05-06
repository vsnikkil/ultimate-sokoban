const { resolve } = require("path");

const webpackConfiguration = {
  mode: "development",
  entry: {
    app: [resolve("src/js")]
  },
  output: {
    filename: "bundle.js",
    path: resolve("dist"),
  },
  devServer: {
    contentBase: resolve("dist"),
    compress: true,
  },
  module: {
    rules: [
      {
        test: /\.png$/i,
        use: {
          loader: "file-loader",
        },
      },
      {
        test: /index\.html$/i,
        use: {
          loader: "file-loader",
          options: {
            name: "index.html",
          },
        }
      },
      {
        test: /\.jsx?$/i,
        include: resolve("src"),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
				test: /\.scss$/,
				use: [{
					loader: "style-loader" // creates style nodes from JS strings
				}, {
					loader: "css-loader" // translates CSS into CommonJS
				}, {
					loader: "sass-loader" // compiles Sass to CSS
				}]
      },
    ]
  }
};

module.exports = webpackConfiguration;
