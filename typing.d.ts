import { Connection } from './src/configs/connection';
import { Crypto } from './src/configs/crypto';
import { LineModel } from './src/configs/line';

declare global {
    namespace Express {
        export interface Request {
            conn: Connection;
            crypto: Crypto;
            line: LineModel;
            fortigateUrl: string;
            clientId: string;
            clientSecret: string;
            char: string;
            charNum: string;
        }
        export interface Response {
        }
    }
}
