const express = require('express');
let app = express();

let port = 3000;

app.use(express.json({}));
app.use(express.static("./static/"));
app.use(express.static("./assets/"));

app.get("/config", (req, res) => { res.json(require("./config.json")); });

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});