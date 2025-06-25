// controllers/FilesController.js
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import fileQueue from '../utils/fileQueue';

class FilesController {
  // ... other methods ...

  static async getFile(req, res) {
    const token = req.header('X-Token');
    const { id } = req.params;
    const size = req.query.size;

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const file = await dbClient.filesCollection.findOne({ _id: new ObjectId(id), userId: new ObjectId(userId) });
    if (!file) return res.status(404).json({ error: 'Not found' });

    let filePath = file.localPath;
    if (size && ['100', '250', '500'].includes(size)) {
      filePath = `${file.localPath}_${size}`;
    }

    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Not found' });

    const mimeType = mime.lookup(file.name);
    res.setHeader('Content-Type', mimeType);
    fs.createReadStream(filePath).pipe(res);
  }

  static async postUpload(req, res) {
    const token = req.header('X-Token');
    const { name, type, parentId = 0, isPublic = false, data } = req.body;

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    if (!name) return res.status(400).json({ error: 'Missing name' });
    if (!type || !['folder', 'file', 'image'].includes(type)) return res.status(400).json({ error: 'Missing type' });
    if (type !== 'folder' && !data) return res.status(400).json({ error: 'Missing data' });

    if (parentId !== 0) {
      const parentFile = await dbClient.filesCollection.findOne({ _id: new ObjectId(parentId) });
      if (!parentFile) return res.status(400).json({ error: 'Parent not found' });
      if (parentFile.type !== 'folder') return res.status(400).json({ error: 'Parent is not a folder' });
    }

    const newFile = {
      userId: new ObjectId(userId),
      name,
      type,
      isPublic,
      parentId,
    };

    if (type === 'folder') {
      const result = await dbClient.filesCollection.insertOne(newFile);
      newFile.id = result.insertedId;
      return res.status(201).json(newFile);
    }

    const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

    const localPath = path.join(folderPath, uuidv4());
    fs.writeFileSync(localPath, Buffer.from(data, 'base64'));

    newFile.localPath = localPath;
    const result = await dbClient.filesCollection.insertOne(newFile);
    newFile.id = result.insertedId;

    // Queue thumbnail generation if image
    if (type === 'image') {
      await fileQueue.add({ userId, fileId: newFile.id.toString() });
    }

    return res.status(201).json({
      id: newFile.id,
      userId,
      name,
      type,
      isPublic,
      parentId,
    });
  }
}

export default FilesController;
