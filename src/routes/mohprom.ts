'use strict';

import * as express from 'express';
import { Radius } from '../models/radius';
const router = express.Router();
const radius = new Radius();

router.post('/otp', async (req, res, next) => {
    try {
        const char = req.char || 'abcdefghijklmnopqrstuvwxyz0123456789';
        const charNum = req.charNum || '0123456789';
        const db = req.conn.db;
        const crypto = req.crypto;
        const line = req.line;
        const pid = req.body.pid;
        const password = crypto.random(6, charNum);
        const ref = crypto.random(5, char);
        const row = await radius.checkUserMohprom(db, { pid }).then();
        const username = row.length > 0 ? row[0].username : pid;
        const data = { pid, ref, username, password };
        await radius.insertMohprom(db, data).then();
        const message = radius.flexMessageOTP({ ref, otp: password });
        line.mophAlert([pid], message).then();
        res.json({ ok: true, ref, pid });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ ok: false, message: error.message, error });
    }
});

router.post('/otp/verify', async (req, res, next) => {
    try {
        const db = req.conn.db;
        const { pid, ref, otp } = req.body;
        const row = await radius.checkUserMohprom(db, { pid, ref, username: pid, password: otp }).then();
        if (row.length > 0) {
            await radius.insertRadius(db, { username: pid, password: otp }, 'mohprom').then();
            res.json({ ok: true, ref, pid });
        } else {
            res.json({ ok: false, message: 'Invalid OTP' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ ok: false, message: error.message, error });
    }
});

export default router;