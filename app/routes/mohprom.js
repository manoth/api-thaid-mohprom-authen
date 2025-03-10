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
const radius_1 = require("../models/radius");
const router = express.Router();
const radius = new radius_1.Radius();
router.post('/otp', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const char = req.char || 'abcdefghijklmnopqrstuvwxyz0123456789';
        const charNum = req.charNum || '0123456789';
        const db = req.conn.db;
        const crypto = req.crypto;
        const line = req.line;
        const pid = req.body.pid;
        const password = crypto.random(6, charNum);
        const ref = crypto.random(5, char);
        const row = yield radius.checkUserMohprom(db, { pid }).then();
        const username = row.length > 0 ? row[0].username : pid;
        const data = { pid, ref, username, password };
        yield radius.insertMohprom(db, data).then();
        const message = radius.flexMessageOTP({ ref, otp: password });
        line.mophAlert([pid], message).then();
        res.json({ ok: true, ref, pid });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ ok: false, message: error.message, error });
    }
}));
router.post('/otp/verify', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = req.conn.db;
        const { pid, ref, otp } = req.body;
        const row = yield radius.checkUserMohprom(db, { pid, ref, username: pid, password: otp }).then();
        if (row.length > 0) {
            yield radius.insertRadius(db, { username: pid, password: otp }, 'mohprom').then();
            res.json({ ok: true, ref, pid });
        }
        else {
            res.json({ ok: false, message: 'Invalid OTP' });
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ ok: false, message: error.message, error });
    }
}));
exports.default = router;
//# sourceMappingURL=mohprom.js.map