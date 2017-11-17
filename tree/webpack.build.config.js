const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        'index': './index.js',
    },
    output: {
        'path': path.resolve(__dirname, './dist'),
        'filename': '[name].js'
    },

    devtool: 'source-map',

    module: {
        rules: [
          {
            test: /\.js$/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  "presets": [   
                    "env", 
                  ],
                  "plugins": [
                    "transform-object-rest-spread",
                    "transform-decorators-legacy"	
                  ]
                }
              }
            ],
            exclude: /node_modules/
          },
          {
              test: /.*\.scss$/, 
              use: ['style-loader', 'css-loader', 'sass-loader']
          },
          {
            test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
            use: ['url-loader?limit=1&name=[name].[ext]']
          }
        ]
    },
		plugins: [
			new UglifyJSPlugin(/*{uglifyOptions: {mangle: false}}*/),
		]

}