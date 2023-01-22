// Make connection
let socket;
socket = io.connect("http://localhost:3000");

// Query DOM
const message = document.getElementById("message"),
	handle = document.getElementById("handle"),
	btn = document.getElementById("send"),
	btnJoin = document.getElementById("join"),
	output = document.getElementById("output"),
	feedback = document.getElementById("feedback"),
	chatBuddy = document.getElementById("to");

// Emit events

btnJoin.addEventListener("click", function () {
	socket.emit("join", {
		handle: handle.value,
		chatBuddy: to.value,
		clientId: socket.id,
	});
});

btn.addEventListener("click", function () {
	socket.emit("chat", {
		message: message.value,
		handle: handle.value,
		chatBuddy: to.value,
		clientId: socket.id,
	});
	message.value = "";
});

message.addEventListener("keypress", function () {
	socket.emit("typing", {
		handle: handle.value,
		chatBuddy: to.value,
	});
});

// Listen for events
socket.on("chat", function (data) {
	feedback.innerHTML = "";
	output.innerHTML +=
		"<p><strong>" + data.handle + ": </strong>" + data.message + "</p>";
});

socket.on("typing", function (data) {
	feedback.innerHTML =
		"<p><em>" + data.handle + " is typing a message...</em></p>";
});
