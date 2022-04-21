const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
	entry: './src/index.js',
	mode: 'production',
	target: 'node',
	experiments: {
		topLevelAwait: true,
	},
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist')
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin({extractComments: false})],
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
	resolve: {
		fallback: {
			fs: false,
			process: false,
		}
	}
};
