import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import mime from 'mime-types';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

class FilesController {
  static async putPublish(req, res) {
    const token = req.header('X-Token');
    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const file = await dbClient.filesCollection.findOne({
      _id: new dbClient.ObjectId(req.params.id),
      userId: new dbClient.ObjectId(userId),
    });

    if (!file) return res.status(404).json({ error: 'Not found' });

    await dbClient.filesCollection.updateOne(
      { _id: file._id },
      { $set: { isPublic: true } }
    );

    file.isPublic = true;
    return res.status(200).json({
      id: file._id.toString(),
      userId: file.userId.toString(),
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    });
  }

  static async putUnpublish(req, res) {
    const token = req.header('X-Token');
    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const file = await dbClient.filesCollection.findOne({
      _id: new dbClient.ObjectId(req.params.id),
      userId: new dbClient.ObjectId(userId),
    });

    if (!file) return res.status(404).json({ error: 'Not found' });

    await dbClient.filesCollection.updateOne(
      { _id: file._id },
      { $set: { isPublic: false } }
    );

    file.isPublic = false;
    return res.status(200).json({
      id: file._id.toString(),
      userId: file.userId.toString(),
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    });
  }

  // Other methods like postUpload, getShow, getIndex...
}

export default FilesController;
