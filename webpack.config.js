const path = require("path");
const tsconfig = require("./tsconfig")

const tsPaths = tsconfig.compilerOptions.paths;
const tsPathKeys = Object.keys(tsPaths)

const aliases = tsPathKeys.reduce((aliases, tsPathKey) => {
	const tsPath = tsPaths[tsPathKey];
	const aliasKey = tsPathKey.replace(/\/\*$/, "");
	aliases[aliasKey] = path.resolve(__dirname, tsPath[0].replace(/\/\*$/, ""));
	return aliases;
}, {});

module.exports = {
	mode: "development",
	entry: {
		index: "./src/index.tsx",
	},
	output: {
		path: path.resolve(__dirname, "docs/build"),
		filename: "[name].js",
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: ["ts-loader"]
			},
			{
				test: /\.scss$/,
				use: ["style-loader", "css-loader", "sass-loader"]
			},
		]
	},
	resolve: {
		extensions: [".js", ".jsx", ".ts", ".tsx", ".scss", ".css"],
		alias: aliases,
	},
	devtool: "source-map",
};