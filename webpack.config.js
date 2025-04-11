const path = require('path');

module.exports = {
  entry: './src/unpack.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.webpack.json',
          },
        }],
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: false,
  output: {
    filename: 'unpack.js',
    path: path.resolve(__dirname, 'public'),
  },
};
