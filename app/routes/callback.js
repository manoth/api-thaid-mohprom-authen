'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const request_1 = require("../models/request");
const radius_1 = require("../models/radius");
const router = express.Router();
const radius = new radius_1.Radius();
const request = new request_1.Request();
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const fortigateUrl = req.fortigateUrl;
    const clientId = req.clientId;
    const clientSecret = req.clientSecret;
    const char = req.char || 'abcdefghijklmnopqrstuvwxyz0123456789';
    const db = req.conn.db;
    const crypto = req.crypto;
    const code = req.query.code;
    const state = req.query.state;
    const authorization = crypto.base64_encode(clientId + ':' + clientSecret);
    try {
        const dataThaid = yield request.thaID(authorization, code);
        const row = yield radius.checkUserThaid(db, dataThaid.pid).then();
        const oldUser = row[0];
        dataThaid.username = yield crypto.random(8, char);
        dataThaid.password = yield crypto.random(16);
        if (row.length > 0) {
            res.render('index', { username: oldUser.username, password: oldUser.password, state, fortigateUrl });
        }
        else {
            yield radius.insertThaid(db, dataThaid).then();
            res.render('index', { username: dataThaid.username, password: dataThaid.password, state, fortigateUrl });
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(500).render('error', { message: error.message, error });
    }
}));
exports.default = router;
//# sourceMappingURL=callback.js.map