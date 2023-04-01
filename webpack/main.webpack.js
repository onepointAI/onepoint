module.exports = {
  resolve: {
    extensions: ['.ts', '.js']
  },
  entry: './electron/main.ts',
  module: {
    rules: [
      ...require('./rules.webpack'),
      {
        test: /\.(m?js|node)$/,
        parser: { amd: false },
        use: {
          // loader: '@marshallofsound/webpack-asset-relocator-loader',
          loader: '@vercel/webpack-asset-relocator-loader',
          options: {
            outputAssetBase: 'native_modules',
          },
        },
      },
    ]
  }
}