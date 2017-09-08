let webpack = require('webpack');
let path = require('path');

module.exports = {
    entry: {
        'index': './index.js',
    },
    output: {
        'path': path.join(__dirname, './dist'),
        'filename': '[name].js'
    },
    // devtool: 'source-map',

    module: {},

    devServer: {
        'content-base': '/',
        'inline': true,
        'host': '0.0.0.0',
        'port': 9123
    }
}
