var webpack = require('webpack');

module.exports = {
    entry: 'index.js',
    output: {
        'filename': 'entry.js',
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
                exclude: /node_modules/,
                loader: 'babel', 
                query: { presets: ['es2015'] }
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
