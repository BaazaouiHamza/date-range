const webpack = require('webpack');
const path = require('path');
const HWP = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: path.join(__dirname, '/src/index.js'),
    output: {
        filename: 'build.js',
        path: path.join(__dirname, '/dist'),
        library: 'DateRange'
    },
    resolve: {
        alias: {
            Utils: path.resolve(__dirname, 'src/Utils/'),
            Components: path.resolve(__dirname, 'src/Components/'),
            Config: path.resolve(__dirname, 'src/Config/'),
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'react', 'stage-2']
            }
        },
        {
            test: /\.(png|jpg|gif)$/i,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }
            ]
        },
        {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                loader: 'file-loader',
                options: {}
                }
            ]
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
    plugins: [
        new HWP({
            template: path.join(__dirname, '/src/index.html')
        }),
        new webpack.ProvidePlugin({
            "React": "react",
        }),
        new CopyWebpackPlugin([
            //{ from: 'src/Assets/', to: 'assets/' },
        ])
    ]
}