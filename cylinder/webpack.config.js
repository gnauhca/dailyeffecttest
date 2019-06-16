const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        main: path.resolve(__dirname, './cylinder.js')
    },
    output: {
        path: path.resolve(__dirname, './dist')
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ]
    },

    devtool: 'source-map',
    devServer: {
        host: '0.0.0.0',
        port: 21000,
        disableHostCheck: true,
        publicPath: '/',
        hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(process.cwd(), 'index.html'),
            filename: 'index.html',
        }),
        // new UglifyJSPlugin(/*{uglifyOptions: {mangle: false}}*/)
    ]
    // module: {
    //     rules: [
    //         {
    //             test: /.*\.scss$/, 
    //             use: ['style-loader', 'css-loader', 'sass-loader']
    //         }
    //     ]
    // },

    // devServer: {
    //     publicPath: '/dist',
    //     disableHostCheck: true,
    //     contentBase: __dirname,
    //     host: '0.0.0.0',
    //     port: 9123
    // }
}