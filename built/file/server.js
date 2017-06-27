"use strict";
/**
 * File Server
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongodb = require("mongodb");
const gm = require("gm");
const drive_file_1 = require("../api/models/drive-file");
/**
 * Init app
 */
const app = express();
app.disable('x-powered-by');
app.locals.cache = true;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
/**
 * Statics
 */
app.use('/assets', express.static(`${__dirname}/assets`, {
    maxAge: 1000 * 60 * 60 * 24 * 365 // 一年
}));
app.get('/', (req, res) => {
    res.send('yee haw');
});
app.get('/default-avatar.jpg', (req, res) => {
    const file = fs.readFileSync(`${__dirname}/assets/avatar.jpg`);
    send(file, 'image/jpeg', req, res);
});
app.get('/app-default.jpg', (req, res) => {
    const file = fs.readFileSync(`${__dirname}/assets/dummy.png`);
    send(file, 'image/png', req, res);
});
async function raw(data, type, download, res) {
    res.header('Content-Type', type);
    if (download) {
        res.header('Content-Disposition', 'attachment');
    }
    res.send(data);
}
async function thumbnail(data, type, resize, res) {
    if (!/^image\/.*$/.test(type)) {
        data = fs.readFileSync(`${__dirname}/assets/dummy.png`);
    }
    let g = gm(data);
    if (resize) {
        g = g.resize(resize, resize);
    }
    g
        .compress('jpeg')
        .quality(80)
        .toBuffer('jpeg', (err, img) => {
        if (err !== undefined && err !== null) {
            console.error(err);
            res.sendStatus(500);
            return;
        }
        res.header('Content-Type', 'image/jpeg');
        res.send(img);
    });
}
function send(data, type, req, res) {
    if (req.query.thumbnail !== undefined) {
        thumbnail(data, type, req.query.size, res);
    }
    else {
        raw(data, type, req.query.download !== undefined, res);
    }
}
/**
 * Routing
 */
app.get('/:id', async (req, res) => {
    // Validate id
    if (!mongodb.ObjectID.isValid(req.params.id)) {
        res.status(400).send('incorrect id');
        return;
    }
    const file = await drive_file_1.default.findOne({ _id: new mongodb.ObjectID(req.params.id) });
    if (file == null) {
        res.status(404).sendFile(`${__dirname} / assets / dummy.png`);
        return;
    }
    else if (file.data == null) {
        res.sendStatus(400);
        return;
    }
    send(file.data.buffer, file.type, req, res);
});
app.get('/:id/:name', async (req, res) => {
    // Validate id
    if (!mongodb.ObjectID.isValid(req.params.id)) {
        res.status(400).send('incorrect id');
        return;
    }
    const file = await drive_file_1.default.findOne({ _id: new mongodb.ObjectID(req.params.id) });
    if (file == null) {
        res.status(404).sendFile(`${__dirname}/assets/dummy.png`);
        return;
    }
    else if (file.data == null) {
        res.sendStatus(400);
        return;
    }
    send(file.data.buffer, file.type, req, res);
});
module.exports = app;