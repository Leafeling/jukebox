const express = require('express');
const { createServer } = require('http');

let app = express();

let port = 3000;
let config = require("./config.json");

app.use(express.json({}));
app.use(express.static("./static/"));
app.use(express.static("./assets/"));

app.get("/config", (req, res) => { res.json(config); });

let httpServer = createServer(app);

const { Server } = require('socket.io');
let io = new Server(httpServer, {});

let currentSong = {
    id: "",
    timeStarted: 0
};
const setCurrentSong = (id) => {
    currentSong.id = id;
    currentSong.timeStarted = Date.now();

    io.emit("current", currentSong);
}

io.on("connection", (socket) => {
    socket.emit("current", currentSong);
});

setCurrentSong("thnXzUFJnfQ");

httpServer.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});