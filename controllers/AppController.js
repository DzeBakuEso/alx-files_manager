import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  /**
   * Checks health of Redis and MongoDB
   */
  static getStatus(req, res) {
    res.status(200).json({ redis: redisClient.isAlive(), db: dbClient.isAlive() });
  }

  /**
   * Returns number of users and files
   */
  static async getStats(req, res) {
    const users = await dbClient.nbUsers();
    const files = await dbClient.nbFiles();
    res.status(200).json({ users, files });
  }
}

export default AppController;
