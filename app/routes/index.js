'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const callback_1 = require("./callback");
const mohprom_1 = require("./mohprom");
router.use('/callback', callback_1.default);
router.use('/mohprom', mohprom_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map