"use strict";
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
exports.Radius = void 0;
class Radius {
    checkUserThaid(db, pid) {
        return db('account_thaid').where('pid', pid);
    }
    insertThaid(db, data) {
        const account_thaid = {
            pid: data.pid, username: data.username, password: data.password,
            firstname: data.given_name, lastname: data.family_name,
            address: data.address.formatted, gender: data.gender, created_at: db.fn.now()
        };
        return db('account_thaid').insert(account_thaid).then(() => __awaiter(this, void 0, void 0, function* () {
            return this.insertRadius(db, account_thaid, 'thaid');
        }));
    }
    checkUserMohprom(db, data) {
        return db('account_mohprom').where(data);
    }
    insertMohprom(db, data) {
        return db('account_mohprom').where('pid', data.pid).then((row1) => __awaiter(this, void 0, void 0, function* () {
            return db('account').where('idn', data.pid).then((row2) => __awaiter(this, void 0, void 0, function* () {
                const user = row1[0];
                const account = row2[0];
                data.updated_at = db.fn.now();
                if (row2.length > 0) {
                    data.prename = account.prename;
                    data.firstname = account.firstname;
                    data.lastname = account.lastname;
                    data.addr = account.addr;
                }
                if (row1.length > 0) {
                    yield db('radusergroup').where('username', user.username).del();
                    yield db('radcheck').where('username', user.username).del();
                    return db('account_mohprom').update(data).where('pid', data.pid);
                }
                else {
                    data.created_at = db.fn.now();
                    return db('account_mohprom').insert(data);
                }
            }));
        }));
    }
    insertRadius(db, data, groupname) {
        return db('radcheck').where('username', data.username).then((row) => __awaiter(this, void 0, void 0, function* () {
            if (row.length === 0) {
                const radusergroup = { username: data.username, groupname: groupname, priority: 1 };
                const radcheck = { username: data.username, attribute: 'Cleartext-Password', op: ':=', value: data.password };
                return db('radusergroup').insert(radusergroup).then(() => {
                    return db('radcheck').insert(radcheck).then();
                });
            }
            else {
                return;
            }
        }));
    }
    flexMessageOTP(data) {
        return {
            "type": "flex",
            "altText": `รหัส OTP สำหรับพิสูจน์ตัวตนก่อนเข้าใช้งาน Internet สสจ.ชัยภูมิ`,
            "contents": {
                "type": "bubble",
                "header": {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                        {
                            "type": "image",
                            "url": "https://trkaj.stripocdn.email/content/guids/CABINET_db309a571db38f0f4a36da4232ee6de6/images/63391554197197263.png",
                            "size": "40px",
                            "aspectRatio": "1:1",
                            "aspectMode": "fit",
                            "gravity": "center",
                            "flex": 0
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "รหัส OTP สำหรับพิสูจน์ตัวตน",
                                    "weight": "bold",
                                    "size": "md",
                                    "color": "#FFFFFF",
                                    "align": "start"
                                },
                                {
                                    "type": "text",
                                    "text": "ก่อนเข้าใช้งาน Internet สสจ.ชัยภูมิ",
                                    "size": "sm",
                                    "color": "#FFFFFF",
                                    "align": "start",
                                    "margin": "sm",
                                    "offsetTop": "2px"
                                }
                            ],
                            "flex": 1
                        }
                    ],
                    "backgroundColor": "#1D75BD",
                    "paddingAll": "20px",
                    "spacing": "md"
                },
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": "รหัส OTP สำหรับพิสูจน์ตัวตน",
                            "weight": "bold",
                            "size": "md",
                            "margin": "none",
                            "color": "#333333",
                            "align": "center"
                        },
                        {
                            "type": "text",
                            "text": `REF: ${data.ref}`,
                            "size": "xs",
                            "color": "#999999",
                            "align": "center",
                            "margin": "sm"
                        },
                        {
                            "type": "text",
                            "text": `${data.otp}`,
                            "weight": "bold",
                            "size": "xxl",
                            "align": "center",
                            "color": "#DD4B39",
                            "margin": "sm"
                        },
                        {
                            "type": "text",
                            "text": "รหัสจะหมดอายุภายใน 10 นาที",
                            "size": "sm",
                            "color": "#999999",
                            "margin": "sm",
                            "align": "center"
                        }
                    ]
                },
                "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": []
                }
            }
        };
    }
}
exports.Radius = Radius;
//# sourceMappingURL=radius.js.map