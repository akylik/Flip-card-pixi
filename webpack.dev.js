import path from 'path';
import { fileURLToPath } from 'url';
import { merge } from 'webpack-merge';
import common from './webpack.common.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  devServer: {
    hot: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    watchFiles: ['src/**/*', 'public/**/*'],
    port: 8080,
    open: true,
    compress: true,
    historyApiFallback: true,
  },

  output: {
    filename: 'js/[name].js',
  },

  plugins: [
  ],
});