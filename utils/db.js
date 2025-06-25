import { MongoClient } from 'mongodb';

// Get environment variables or use defaults
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const dbName = process.env.DB_DATABASE || 'files_manager';

class DBClient {
  constructor() {
    const uri = `mongodb://${host}:${port}`;
    this.client = new MongoClient(uri, { useUnifiedTopology: true });
    this.db = null;
    this.usersCollection = null;
    this.filesCollection = null;

    this.client.connect()
      .then(() => {
        this.db = this.client.db(dbName);
        this.usersCollection = this.db.collection('users');
        this.filesCollection = this.db.collection('files');
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
    return this.usersCollection.countDocuments();
  }

  /**
   * Counts documents in files collection
   * @returns {Promise<number>}
   */
  async nbFiles() {
    return this.filesCollection.countDocuments();
  }
}

// Export instance
const dbClient = new DBClient();
export default dbClient;
