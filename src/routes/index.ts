'use strict';

import * as express from 'express';
const router = express.Router();

import callback from './callback';
import mohprom from './mohprom';
router.use('/callback', callback);
router.use('/mohprom', mohprom);

export default router;