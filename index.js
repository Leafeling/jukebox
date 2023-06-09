const express = require('express');
const { createServer } = require('http');

let app = express();

let config = require("./config.json");
require('dotenv').config();
let port = process.env.JUKEBOX_PORT ?? 3000;

app.use(express.static("./static/"));
app.use(express.static("./assets/"));

app.get("/config", (req, res) => { res.json(config); });

let httpServer = createServer(app);

const { Server } = require('socket.io');
let io = new Server(httpServer, {});

let queueProvider = require(`./queue/${config.provider}.js`);
let currentSong = null;

const setCurrentSong = (song) => {
    currentSong = song;

    io.emit("current", currentSong);
    io.emit("queue_list", queue);

    if (!!currentSong) {
        currentSong.timeStarted = Date.now();

        setTimeout(async () => {
            setCurrentSong(await queueProvider.nextSong());
        }, currentSong.duration * 1000);
    }
}

io.on("connection", (socket) => {
    socket.identity = null;

    socket.on("queue", async (link) => {
        queueProvider.addSong(socket.identity, link)
            .then(async () => {
                socket.emit("queue_success");
                if (!currentSong) setCurrentSong(await queueProvider.nextSong());
                
                io.emit("queue_list", queue);
            })
            .catch((err) => socket.emit("queue_error", err));
    });

    socket.on("auth", async (auth) => {
        // TODO: Authenticate the user before forwarding their identity.
        socket.identity = auth;
        socket.emit("auth_success");
    });

    socket.emit("current", currentSong);
    socket.emit("queue_list", queue);
});

httpServer.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});