const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	mode: 'production',
	target: 'node',
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.hbs$/,
				loader: 'handlebars-loader',
				options: { helperDirs: [path.join(__dirname, 'src', 'helpers')] }
			},
			{
				test: /\.m?js$/,
				exclude: [
					path.resolve(__dirname, 'node_modules')
				],
				use: {
					// `.swcrc` can be used to configure swc
					loader: 'swc-loader',
				}
			}
		]
	},
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1
		})
	],
	resolve: {
		fallback: {
			fs: false,
			process: false,
		}
	}
};
