const webpack = require('webpack');
const path = require('path');

const MODE = process.env.NODE_ENV || 'development';
const PRODUCTION = MODE === 'production';

module.exports = {
    mode: MODE,
    devtool: PRODUCTION ? 'hidden-source-map' : 'source-map',
    entry: ['./src/App.js'],
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'build'),
        publicPath: '/build/',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: { loader: 'babel-loader' },
            },
        ],
    },
    devServer: {
        open: true,
        port: 3334,
        publicPath: '/build/',
    },
    performance: { hints: false },
};
