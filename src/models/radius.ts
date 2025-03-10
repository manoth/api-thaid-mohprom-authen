import { Knex } from 'knex';

export class Radius {

    checkUserThaid(db: Knex, pid: string) {
        return db('account_thaid').where('pid', pid);
    }

    insertThaid(db: Knex, data: any) {
        const account_thaid = {
            pid: data.pid, username: data.username, password: data.password,
            firstname: data.given_name, lastname: data.family_name,
            address: data.address.formatted, gender: data.gender, created_at: db.fn.now()
        };
        return db('account_thaid').insert(account_thaid).then(async () => {
            return this.insertRadius(db, account_thaid, 'thaid');
        });
    }

    checkUserMohprom(db: Knex, data: any) {
        return db('account_mohprom').where(data);
    }

    insertMohprom(db: Knex, data: any) {
        return db('account_mohprom').where('pid', data.pid).then(async (row1) => {
            return db('account').where('idn', data.pid).then(async (row2) => {
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
                    await db('radusergroup').where('username', user.username).del();
                    await db('radcheck').where('username', user.username).del();
                    return db('account_mohprom').update(data).where('pid', data.pid);
                } else {
                    data.created_at = db.fn.now();
                    return db('account_mohprom').insert(data);
                }
            });
        });
    }

    insertRadius(db: Knex, data: any, groupname: string) {
        return db('radcheck').where('username', data.username).then(async (row) => {
            if (row.length === 0) {
                const radusergroup = { username: data.username, groupname: groupname, priority: 1 };
                const radcheck = { username: data.username, attribute: 'Cleartext-Password', op: ':=', value: data.password };
                return db('radusergroup').insert(radusergroup).then(() => {
                    return db('radcheck').insert(radcheck).then();
                });
            } else {
                return;
            }
        });
    }

    flexMessageOTP(data: any) {
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