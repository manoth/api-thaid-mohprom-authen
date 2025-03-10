"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineModel = void 0;
const moment = require("moment");
const request = require("request-promise");
const crypto_1 = require("./crypto");
moment.locale('th');
const crypto = new crypto_1.Crypto();
class LineModel {
    notify(token, message) {
        if (token) {
            return request({
                method: 'POST',
                uri: 'https://notify-api.line.me/api/notify',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                auth: { 'bearer': token },
                form: { message: message }
            });
        }
        else {
            return true;
        }
    }
    mophAlert(to, message) {
        return request.post({
            uri: 'https://cvp1.moph.go.th/token?Action=get_moph_access_token',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                hospital_code: process.env.MOPH_HOSPCODE,
                user: process.env.MOPH_USERNAME,
                password_hash: crypto.hmacSHA256(process.env.MOPH_PASSWORD)
            },
            json: true
        }).then(jwtToken => {
            this.sendMessageMoph(jwtToken, to, message).then().catch((err) => {
                console.error('Line notification error:', err.message);
            });
        });
    }
    sendMessageMoph(jwtToken, to, message) {
        return request.post({
            uri: `https://morpromt2c.moph.go.th/api/v2/send-message/send-now`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken
            },
            body: {
                datas: to,
                messages: [message]
            },
            json: true
        });
    }
}
exports.LineModel = LineModel;
//# sourceMappingURL=line.js.map