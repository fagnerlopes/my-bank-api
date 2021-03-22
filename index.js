import express from 'express';
import accountsRouter from './routes/account.js';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

const app = express();
app.use(express.json());

app.use('/accounts', accountsRouter);

app.listen(3000, async () => {

  try {
    await readFile('accounts.json');
    console.log('API started '); 
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: []
    }
    writeFile('accounts.json', JSON.stringify(initialJson)).then(() => {
      console.log('API started and file created');
    }).catch(err => {
      console.log(err); 
    });    
  }
});