import "./dev.style";
import "@prod/index";
import io from "socket.io-client";

const socket = io();

socket.on("buildSuccess", () => {
	window.location.reload();
});

socket.on("buildFail", (errors: any) => {
	console.log(errors);
});
