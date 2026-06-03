import express from 'express';
import { MongoClient } from 'mongodb';
import { MongoConfig } from './config/db.js';
import 'dotenv/config'

const app = express();

app.listen(process.env.PORT, async () => {
  console.log(`Sevidor corriendo en el puerto ${process.env.PORT}`);
  await MongoConfig.connect();
});