'use strict';

import * as express from 'express';
import { Request } from '../models/request';
import { Radius } from '../models/radius';
const router = express.Router();
const radius = new Radius();
const request = new Request();

router.get('/', async (req, res, next) => {
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
        const dataThaid = await request.thaID(authorization, code);
        const row = await radius.checkUserThaid(db, dataThaid.pid).then();
        const oldUser = row[0];
        dataThaid.username = await crypto.random(8, char);
        dataThaid.password = await crypto.random(16);
        if (row.length > 0) {
            res.render('index', { username: oldUser.username, password: oldUser.password, state, fortigateUrl });
        } else {
            await radius.insertThaid(db, dataThaid).then();
            res.render('index', { username: dataThaid.username, password: dataThaid.password, state, fortigateUrl });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).render('error', { message: error.message, error });
    }
});

export default router;