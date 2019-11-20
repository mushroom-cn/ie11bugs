const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const ZipPlugin = require('zip-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
module.exports = function (env = {}, args) {
	let entry = {
		["absolute-over-fixed"]: './src/absolute-over-fixed/index.ts',
	};
	const plugins = [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: `[name].bundle.min.css`,
		}),
		new HtmlWebpackPlugin({
			chunks: ["vendor", "runtime", "absolute-over-fixed"],
			template: 'src/absolute-over-fixed/index.html',
			filename: "absolute-over-fixed/index.html",
		}),
		new CheckerPlugin(),
		new webpack.ProgressPlugin({
			entries: true,
			modules: true,
			modulesCount: 100,
			profile: true,
		}),
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
	];
	return {
		entry,
		mode: "development",
		module: {
			rules: [
				{
					test: /\.(less)$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
							options: {
								hmr: true,
							},
						},
						// {
						// 	loader: "style-loader",
						// },
						{
							loader: 'css-loader'
						},
						{
							loader: 'less-loader',
						},
					]
				},
				{
					test: /\.tsx?$/,
					exclude: /node_modules/,
					use: {
						loader: 'awesome-typescript-loader',
						options: {
							transpileOnly: true,
							experimentalWatchApi: true,
						},
					},
				},
				{
					test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
					loader: 'url-loader',
				},
			]
		},
		resolve: {
			extensions: [
				'.tsx',
				'.ts',
				'.js'
			]
		},
		output: {
			filename: `[name].bundle.min.js`,
			path: path.resolve(__dirname, "dist"),
		},
		optimization: {
			splitChunks: {
				chunks: 'all',
				minChunks: 1,
				name: true,
				cacheGroups: {
					vendors: {
						name: "vendor",
						test: /[\\/]node_modules[\\/]/,
						reuseExistingChunk: true,
						chunks: 'all'
					},
				}
			},
			runtimeChunk: 'single',
			minimizer: [],
		},
		plugins,
		watch: true,
		watchOptions: {
			ignored: [/node_modules/, /dist/],
			poll: 4000 // Check for changes every second,
		},
		devServer: {
			contentBase: path.join(__dirname, 'dist'),
			compress: true,
			index: "absolute-over-fixed/index.html",
			inline: true,
			hot: true,
			hotOnly: true,
			watchOptions: {
				poll: 4000,
				ignored: [/node_modules/, /dist/]
			},
		},
	};
}