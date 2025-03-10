"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const request = require("request-promise");
class Request {
    thaID(authorization, code) {
        return request.post({
            uri: 'https://imauth.bora.dopa.go.th/api/v2/oauth2/token/',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + authorization
            },
            form: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: 'https://apicpho.moph.go.th/authen/callback'
            },
            json: true
        });
    }
}
exports.Request = Request;
//# sourceMappingURL=request.js.map