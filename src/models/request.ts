import * as request from 'request-promise';

export class Request {

    thaID(authorization: string, code: any) {
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