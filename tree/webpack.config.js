const webpack = require('webpack');
const path = require('path');

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
                test: /.*\.scss$/, 
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },

    devServer: {
        publicPath: '/dist',
        disableHostCheck: true,
        contentBase: __dirname,
        host: '0.0.0.0',
        port: 9123
    }
}