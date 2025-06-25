// controllers/UsersController.js (add to existing file)
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static async postNew(req, res) {
    // Already implemented in Task 3
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await dbClient.usersCollection.findOne({ _id: dbClient.ObjectId(userId) });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    return res.status(200).json({ id: user._id.toString(), email: user.email });
  }
}

export default UsersController;
