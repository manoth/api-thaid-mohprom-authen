'use strict';

import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as ejs from 'ejs';
import * as cors from 'cors';

import index from './routes/index';

import { Connection } from './configs/connection';
import { Crypto } from './configs/crypto';
import { LineModel } from './configs/line';

dotenv.config();
const app: express.Express = express();
//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname,'public','favicon.ico')));

//view engine setup
app.set('views', path.join(__dirname, '../views'));
app.engine('.html', ejs.renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use((req, res, next) => {
  req.conn = new Connection();
  req.crypto = new Crypto();
  req.line = new LineModel();
  req.fortigateUrl = process.env.FORTIGATE_URL;
  req.clientId = process.env.THAID_CLIENT_ID;
  req.clientSecret = process.env.THAID_CLIENT_SECRET;
  req.char = process.env.CHAR;
  req.charNum = process.env.CHAR_NUM;
  next();
});
app.use('/authen', index);

//catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err['status'] = 404;
  next(err);
});

//error handlers

//development error handler
//will print stacktrace
if (process.env.NODE_ENV === 'development') {
  app.use((err: Error, req, res, next) => {
    res.status(err['status'] || 500);
    res.json({
      title: 'error',
      status: err['status'],
      message: err.message,
      error: err
    });
  });
}

//production error handler
// no stacktrace leaked to user
app.use((err: Error, req, res, next) => {
  res.status(err['status'] || 500);
  res.json({
    title: 'error',
    status: err['status'],
    message: err.message,
    error: {}
  });
});

export default app;
