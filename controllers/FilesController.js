import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class FilesController {
  // ... postUpload method already here ...

  static async getShow(req, res) {
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const fileId = req.params.id;
    if (!ObjectId.isValid(fileId)) return res.status(404).json({ error: 'Not found' });

    const file = await dbClient.db.collection('files').findOne({
      _id: ObjectId(fileId),
      userId: ObjectId(userId),
    });

    if (!file) return res.status(404).json({ error: 'Not found' });

    return res.json({
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    });
  }

  static async getIndex(req, res) {
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const parentId = req.query.parentId || '0';
    const page = Number.parseInt(req.query.page, 10) || 0;
    const limit = 20;
    const skip = page * limit;

    const matchQuery = { userId: ObjectId(userId), parentId };
    if (parentId !== '0' && ObjectId.isValid(parentId)) {
      matchQuery.parentId = ObjectId(parentId);
    }

    const files = await dbClient.db.collection('files')
      .aggregate([
        { $match: matchQuery },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            id: '$_id',
            userId: '$userId',
            name: '$name',
            type: '$type',
            isPublic: '$isPublic',
            parentId: '$parentId',
          },
        },
      ])
      .toArray();

    return res.json(files);
  }
}

export default FilesController;
