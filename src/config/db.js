import { MongoClient } from 'mongodb';

class MongoDB {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) {
      console.log('Ya existe una conexion a MongoDB');
      return;
    }

    try {
      this.client = new MongoClient(process.env.MONGODB_URI);

      await this.client.connect();
      this.db = this.client.db(process.env.DB_NAME);
      this.isConnected = true;

      console.log('MongoDB conextado exitosamente');
      return this.db;
    } catch (error) {
      console.error('Error: ', error.message);
    }
  }

  getDB() {
    if (!this.db) {
      throw new Error('Base de datos no inicializada');
    }

    return this.db;
  }

  getCollection(collectionName) {
    return this.getDB().collection(collectionName);
  }
}

export const MongoConfig = new MongoDB();