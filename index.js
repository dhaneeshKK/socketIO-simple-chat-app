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
		origins: "*",
		methods: ["GET", "POST"],
	},
});

const roomList = [];
io.on("connection", (socket) => {
	console.log("made socket connection", socket.id);

	// Create room array

	socket.on("join", function (data) {
		console.log(data);
		const fromId = data.clientId + data.handle;
		if (!roomList.find((val) => val === fromId)) {
			roomList.push(fromId);
		}
		console.log(roomList);
	});

	// Handle chat event
	socket.on("chat", function (data) {
		console.log(roomList);

		roomList.forEach((element) => {
			if (element.match(data.chatBuddy)) {
				console.log(`message to be send to ${data.chatBuddy}`);
				const roomToSend = element.replace(`${data.chatBuddy}`, "");
				console.log(roomToSend);
				socket.to(roomToSend).emit("chat", data);
			}
		});
		//socket.to(roomToSend).emit("chat", data);

		//io.sockets.emit("chat", data);
	});

	// Handle typing event
	socket.on("typing", function (data) {
		socket.broadcast.emit("typing", data);
	});
});
