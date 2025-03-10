"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crypto = void 0;
const CryptoJs = require("crypto-js");
class Crypto {
    aes_encrypt(data, secret) {
        let hashSha512 = CryptoJs.SHA512(secret || process.env.SECRET_KEY).toString(CryptoJs.enc.Hex);
        let secretKey = CryptoJs.enc.Base64.stringify(CryptoJs.enc.Hex.parse(hashSha512)).substring(0, 32);
        let ciphertext = CryptoJs.AES.encrypt(data, secretKey, {
            iv: secretKey,
            mode: CryptoJs.mode.CBC,
            padding: CryptoJs.pad.Pkcs7
        });
        return this.base64_encode(ciphertext.toString());
    }
    aes_decrypt(enc, secret) {
        let hashSha512 = CryptoJs.SHA512(secret || process.env.SECRET_KEY).toString(CryptoJs.enc.Hex);
        let secretKey = CryptoJs.enc.Base64.stringify(CryptoJs.enc.Hex.parse(hashSha512)).substring(0, 32);
        let bytes = CryptoJs.AES.decrypt(this.base64_decode(enc), secretKey, {
            iv: secretKey,
            mode: CryptoJs.mode.CBC,
            padding: CryptoJs.pad.Pkcs7
        });
        return bytes.toString(CryptoJs.enc.Utf8);
    }
    base64_encode(str) {
        const encryptedWord = CryptoJs.enc.Utf8.parse(str);
        return CryptoJs.enc.Base64.stringify(encryptedWord);
    }
    base64_decode(enc) {
        const encryptedWord = CryptoJs.enc.Base64.parse(enc);
        return CryptoJs.enc.Utf8.stringify(encryptedWord);
    }
    md5(str) {
        return CryptoJs.MD5(str).toString();
    }
    hmacSHA256(password) {
        const secretKey = process.env.MOPH_SECRET_KEY;
        return CryptoJs.HmacSHA256(password, secretKey).toString(CryptoJs.enc.Hex);
    }
    random(length, char) {
        let result = '';
        const characters = char || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
}
exports.Crypto = Crypto;
//# sourceMappingURL=crypto.js.map