var webpack = require('webpack');

module.exports = {
    entry: {
        'onestar': 'onestar.js',
        'meteorshower': 'meteorshower.js',
        'meteorshower-bg': 'meteorshower-bg.js'
    },
    output: {
        'path': './dist',
        'filename': '[name].js'
    },
    resolve: {
        root: process.cwd(),
        modulesDirectories: ['node_modules']
    },

    devtool: 'source-map',

    module: {
        loaders: [
            { test: /.*\.scss$/, loaders: ['style', 'css', 'sass'] },
            {
                test: /.*?\.js$/,
                loader: 'babel', 
                query: { 
                    presets: [ 'es2015'],
                    plugins: ["transform-object-assign"]
                }
            }
        ]
    },

    devServer: {
        'content-base': '/',
        'inline': true,
        'host': '0.0.0.0',
        'port': 9123
    }
}
