import * as moment from 'moment';
import * as request from 'request-promise';
import { Crypto } from './crypto';
moment.locale('th');
const crypto = new Crypto();

export class LineModel {

    notify(token: string, message: string) {
        if (token) {
            return request({
                method: 'POST',
                uri: 'https://notify-api.line.me/api/notify',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                auth: { 'bearer': token },
                form: { message: message }
            });
        } else {
            return true;
        }
    }

    mophAlert(to: any[], message: object) {
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
            this.sendMessageMoph(jwtToken, to, message).then().catch((err: any) => {
                console.error('Line notification error:', err.message);
            });
        });
    }

    sendMessageMoph(jwtToken: string, to: any[], message: object) {
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