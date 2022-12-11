const express = require("express");
const app = express();
const port = 3000;

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const fs = require("fs");

const images = [];
const imagesSrc = "../data/images.txt";
fs.readFile(imagesSrc, (err, data) => {
    if (err) console.log(err);

    images.push(...JSON.parse(data));
});

app.get("/images", (req, res) => {
    res.send(JSON.stringify(images));
});

app.post("/images", (req, res) => {
    images.push(...req.body);
    fs.writeFileSync(imagesSrc, JSON.stringify(images));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
