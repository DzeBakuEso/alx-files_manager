// utils/db.js
import { MongoClient } from 'mongodb';

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const dbName = process.env.DB_DATABASE || 'files_manager';

class DBClient {
  constructor() {
    const uri = `mongodb://${host}:${port}`;
    this.client = new MongoClient(uri, { useUnifiedTopology: true });
    this.db = null;

    this.client.connect().then(() => {
      this.db = this.client.db(dbName);
      this.usersCollection = this.db.collection('users');
      this.filesCollection = this.db.collection('files');
    }).catch((err) => {
      console.error('MongoDB connection error:', err.message);
    });
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    return this.usersCollection?.countDocuments() || 0;
  }

  async nbFiles() {
    return this.filesCollection?.countDocuments() || 0;
  }
}

const dbClient = new DBClient();
export default dbClient;
