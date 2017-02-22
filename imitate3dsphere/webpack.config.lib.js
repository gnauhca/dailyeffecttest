var webpack = require('webpack');

module.exports = {
    entry: 'f3/f3.js',
    output: {
        'path': 'dist/f3',
        'filename': 'f3.js',
        'library': "F3",
        'libraryTarget': "umd",
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
