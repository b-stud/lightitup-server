const path = require('path');
const debug = process.env.NODE_ENV !== "production";
const webpack = require('webpack');

module.exports = {
    entry: './ts/ScriptMain.ts',
    devtool: debug ? "inline-sourcemap" : false,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },

            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                options: {
                    failOnHint: true,
                    configuration: require('./tslint.json')
                }
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        filename: 'server-interface.js',
        path: path.resolve(__dirname, 'dist')
    },

    plugins: debug ? [] : [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ]
};
