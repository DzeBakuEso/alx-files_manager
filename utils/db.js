import { MongoClient } from 'mongodb';

// Get environment variables or use defaults
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const dbName = process.env.DB_DATABASE || 'files_manager';

class DBClient {
  constructor() {
    const uri = `mongodb://${host}:${port}`;
    this.client = new MongoClient(uri, { useUnifiedTopology: true });
    this.client.connect()
      .then(() => {
        this.db = this.client.db(dbName);
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err.message);
      });
  }

  /**
   * Checks if MongoDB is connected
   * @returns {boolean}
   */
  isAlive() {
    return !!this.db;
  }

  /**
   * Counts documents in users collection
   * @returns {Promise<number>}
   */
  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  /**
   * Counts documents in files collection
   * @returns {Promise<number>}
   */
  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

// Export instance
const dbClient = new DBClient();
export default dbClient;
