// controllers/UsersController.js
import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import userQueue from '../utils/userQueue';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    const userExist = await dbClient.usersCollection.findOne({ email });
    if (userExist) return res.status(400).json({ error: 'Already exist' });

    const hashedPassword = sha1(password);
    const newUser = { email, password: hashedPassword };
    const result = await dbClient.usersCollection.insertOne(newUser);
    const userId = result.insertedId;

    // Add job to welcome queue
    await userQueue.add({ userId: userId.toString() });

    return res.status(201).json({ id: userId, email });
  }

  static async getMe(req, res) {
    const token = req.header('X-Token');
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await dbClient.usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    return res.status(200).json({ id: user._id, email: user.email });
  }
}

export default UsersController;
