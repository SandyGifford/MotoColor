import path from "path";
import { Configuration } from "webpack";
import glob from "glob";

const tsconfig = require("./tsconfig");

const tsPaths = tsconfig.compilerOptions.paths;
const tsPathKeys = Object.keys(tsPaths)

const aliases = tsPathKeys.reduce((aliases, tsPathKey) => {
	const tsPath = tsPaths[tsPathKey];
	const aliasKey = tsPathKey.replace(/\/\*$/, "");
	aliases[aliasKey] = path.resolve(__dirname, tsPath[0].replace(/\/\*$/, ""));
	return aliases;
}, {} as { [key: string]: string });

const config: Configuration = {
	mode: "development",
	entry: {
		index: "./src/prod/index.tsx",
		dev: "./src/dev/client/dev.ts",
		...glob.sync("./src/**/*.worker.ts").reduce((obj, path) => {
			const [, name] = path.match(/\.\/src\/.*\/(.*)\.worker\.ts/);
			obj[`workers/${name}`] = path;
			return obj;
		}, {} as { [key: string]: string }),
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

export default config;
