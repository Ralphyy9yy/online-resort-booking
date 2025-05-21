import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express()
app.use(cors());

const db = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '',
database: 'easystay'
})
app.get('/',(re, res)=>{
    return res.json('Hello World')
})

app.listen(5000, () => {
    console.log('Server is running on port 3000')
})