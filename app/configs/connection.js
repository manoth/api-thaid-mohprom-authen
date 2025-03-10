"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const knex_1 = require("knex");
class Connection {
    get db() {
        return (0, knex_1.knex)({
            client: process.env.RADIUS_TYPE,
            connection: {
                host: process.env.RADIUS_HOST,
                port: +process.env.RADIUS_PORT,
                user: process.env.RADIUS_USERNAME,
                password: process.env.RADIUS_PASSWORD,
                database: process.env.RADIUS_DBNAME,
                timezone: process.env.RADIUS_TIMEZONE,
                charset: process.env.RADIUS_CHARSET
            },
            pool: {
                min: 0,
                max: 7,
                afterCreate: (conn, done) => {
                    conn.query('SET NAMES utf8', (err) => {
                        done(err, conn);
                    });
                }
            },
            debug: false,
            acquireConnectionTimeout: 10000
        });
    }
}
exports.Connection = Connection;
//# sourceMappingURL=connection.js.map