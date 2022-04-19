//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');


module.exports = [
  {
    entry: './src/browser.ts',
    module: {
        rules: [
          {
            test: /\.ts?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
      },
    mode: "production",
    target: ['web','es5'], //'web',
    output: {
      filename: 'umd.js',
      path: path.resolve(__dirname, 'browser'),
      libraryTarget: 'umd',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    // plugins: [
    //   new BundleAnalyzerPlugin()
    // ]
  }
];