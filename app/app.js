'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const ejs = require("ejs");
const cors = require("cors");
const index_1 = require("./routes/index");
const connection_1 = require("./configs/connection");
const crypto_1 = require("./configs/crypto");
const line_1 = require("./configs/line");
dotenv.config();
const app = express();
app.set('views', path.join(__dirname, '../views'));
app.engine('.html', ejs.renderFile);
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use((req, res, next) => {
    req.conn = new connection_1.Connection();
    req.crypto = new crypto_1.Crypto();
    req.line = new line_1.LineModel();
    req.fortigateUrl = process.env.FORTIGATE_URL;
    req.clientId = process.env.THAID_CLIENT_ID;
    req.clientSecret = process.env.THAID_CLIENT_SECRET;
    req.char = process.env.CHAR;
    req.charNum = process.env.CHAR_NUM;
    next();
});
app.use('/authen', index_1.default);
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
if (process.env.NODE_ENV === 'development') {
    app.use((err, req, res, next) => {
        res.status(err['status'] || 500);
        res.json({
            title: 'error',
            status: err['status'],
            message: err.message,
            error: err
        });
    });
}
app.use((err, req, res, next) => {
    res.status(err['status'] || 500);
    res.json({
        title: 'error',
        status: err['status'],
        message: err.message,
        error: {}
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map