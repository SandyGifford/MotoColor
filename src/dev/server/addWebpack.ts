import webpack from "webpack";
import socket from "socket.io";
import webpackConfig from "../../../webpack.config";
import { Server } from "http";

export default (http: Server) => {
	const io = socket(http);
	let lastFail: string[];

	function sendFail() {
		io.emit("buildFail", lastFail);
	}

	function sendSuccess() {
		io.emit("buildSuccess");
	}

	io.on("connection", (socket) => {
		console.log("a user connected");

		if (lastFail) sendFail();

		socket.on("disconnect", () => {
			console.log("a user disconnected");
		});
	});

	webpack(webpackConfig)
		.watch({}, (err, stats) => {
			if (err) throw err;

			process.stdout.write(stats.toString({
				colors: true,
				modules: false,
				children: false,
				chunks: false,
				chunkModules: false,
			}) + "\n");

			const compStr = `build complete: http://localhost:3000`;
			const dashes = compStr.split("").map(() => "-").join("");
			console.log(`${dashes}\n${compStr}\n${dashes}`);

			if (stats.hasErrors()) {
				lastFail = stats.compilation.errors.map(e => e.message);
				sendFail();
			} else {
				lastFail = null;
				sendSuccess();
			}
		});
}