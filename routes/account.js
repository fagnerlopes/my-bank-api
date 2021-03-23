import express from "express";
const router = express.Router();
import { promises as fs } from "fs";
const { readFile, writeFile } = fs;

router.post("/", async (req, res, next) => {
  try {
    let account = req.body;
    const data = JSON.parse(await readFile(fileName));
    account = { id: data.nextId, ...account };
    data.nextId++; 
    data.accounts.push(account);

    await writeFile(fileName, JSON.stringify(data, null, 2));
    
    res.send(account);
  } catch (err) {
    next(err);     
  }  
});

router.get('/', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(fileName));
    delete data.nextId;
    res.send(data);
    
  } catch (err) {
    next(err);     
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    let id = req.params.id;
    const data = JSON.parse(await readFile(fileName));
    const account = data.accounts.find(account => account.id === parseInt(id));
    res.send(account);    
  } catch (err) {
    next(err);      
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    let id = req.params.id;
    const data = JSON.parse(await readFile(fileName));
    data.accounts = data.accounts.filter(account => {
      return account.id !== parseInt(id);
    });
    console.log(data);
    await writeFile(fileName, JSON.stringify(data, null, 2)); 
    res.end();  
  } catch (err) {
    next(err);     
  }
});

router.put('/', async (req, res, next) => {
  try {
    let account = req.body;
    const data = JSON.parse(await readFile(fileName));
    const index = data.accounts.findIndex(a => a.id === parseInt(account.id));

    data.accounts[index] = account;

    writeFile(fileName, JSON.stringify(data));    
    res.send(account); 
  } catch (err) {
    next(err);     
  }
});

router.patch('/update-balance', async (req, res, next) => {
  try {
    let account = req.body;
    const data = JSON.parse(await readFile(fileName));
    const index = data.accounts.findIndex(a => a.id === parseInt(account.id));

    data.accounts[index].balance = account.balance;

    writeFile(fileName, JSON.stringify(data));    
    res.send(data.accounts[index]); 
  } catch (err) {
    next(err);     
  }
});

router.use((err, req, res, next) =>{
  console.log(err);
  res.status(400).send({error: err.message});
});
export default router;
