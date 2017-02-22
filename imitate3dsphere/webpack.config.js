var webpack = require('webpack');

module.exports = {
    entry: 'index.js',
    output: {
        'path': 'dist',
        'filename': 'entry.js',
        'publicPath': '/'
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
        'inline': true,
        'host': '0.0.0.0',
        'port': 9123
    }
}
