import Bull from 'bull';
import imageThumbnail from 'image-thumbnail';
import dbClient from './utils/db';
import fs from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';

const fileQueue = new Bull('fileQueue');

fileQueue.process(async (job, done) => {
  const { fileId, userId } = job.data;

  if (!fileId) return done(new Error('Missing fileId'));
  if (!userId) return done(new Error('Missing userId'));

  const file = await dbClient.filesCollection.findOne({ _id: new ObjectId(fileId), userId: new ObjectId(userId) });

  if (!file) return done(new Error('File not found'));

  const sizes = [500, 250, 100];

  await Promise.all(sizes.map(async (size) => {
    try {
      const thumbnail = await imageThumbnail(file.localPath, { width: size });
      fs.writeFileSync(`${file.localPath}_${size}`, thumbnail);
    } catch (err) {
      console.error(`Thumbnail generation failed for size ${size}:`, err.message);
    }
  }));

  done();
});
