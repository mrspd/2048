var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ENV = process.env.NODE_ENV || 'dev';

var entries = [
    "./index",
    "./assets/main.scss"
];

if(ENV == 'dev') {
    //entries.push("webpack-dev-server/client?http://localhost:8082/");
    //entries.push("webpack/hot/dev-server");
};

module.exports = {
    context: __dirname + "/src",
    entry: entries,
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js",
        publicPath: ""
    },
    devtool: 'source-map',
    resolve: {
        modules: [path.resolve(__dirname + '/src'), 'src', 'node_modules'],
        extensions: ['.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react', 'stage-0']
                }
            },
            {
                test: /\.scss$/,
                exclude: /(node_modules|bower_components)/,
                loader: ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader!sass-loader"})
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(ENV)
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'assets/index.html',
            assets: {
                style: 'style.css'
            },
            env: ENV
        }),
        new ExtractTextPlugin({filename: 'style.css', allChunks: true}),
        new webpack.HotModuleReplacementPlugin(),
        //new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        hot: true,
        inline: true,
        historyApiFallback: true
    }
};