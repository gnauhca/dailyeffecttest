var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        'main': './src/js/main.js',
    },
    output: {
        'path': path.join(__dirname, './dist'),
        'filename': '[name].js'
    },
    devtool: 'source-map',

    resolve: {
        alias: {
            Src: path.join(__dirname, './src'),
            View: path.join(__dirname, './src/js/view')
        }
    },

    module: {
        rules: [
            { test: /.*\.scss$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] },
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     use: 'babel-loader'
            // },
        ]
    },

    devServer: {
        'disableHostCheck': true,
        'inline': true,
        'host': '0.0.0.0',
        'port': 9123
    }
}
