import { knex } from 'knex';

export class Connection {

    public get db() {
        return knex({
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