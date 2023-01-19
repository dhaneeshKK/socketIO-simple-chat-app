import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const serverHttp = http.createServer(app);

app.use(cors());

serverHttp.listen(3000, () => {
	console.log("listening on *:3000");
});

// Static files
app.use(express.static("public"));

// Socket setup & pass server

const io = new Server(serverHttp, {
	cors: {
		origins: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log("made socket connection", socket.id);

	// Handle chat event
	socket.on("chat", function (data) {
		// console.log(data);
		io.sockets.emit("chat", data);
	});

	// Handle typing event
	socket.on("typing", function (data) {
		socket.broadcast.emit("typing", data);
	});
});
