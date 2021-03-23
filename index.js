import express from 'express';
import winston from 'winston';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './doc.js';
import accountsRouter from './routes/account.js';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: "my-bank-api.log" })
  ],
  format: combine(
    label({ label: 'my-bank-api'}),
    timestamp(),
    myFormat
  ) 
});
 
global.fileName = 'accounts.json';

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use('/accounts', accountsRouter);

app.listen(3000, async () => {

  try {
    await readFile(fileName);
    logger.info('API started '); 
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: []
    }
    writeFile(fileName, JSON.stringify(initialJson)).then(() => {
      logger.info('API started and file created');
    }).catch(err => {
      logger.error(err);
    });    
  }
});