// worker.js
import Bull from 'bull';
import dbClient from './utils/db';
import fs from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';
import imageThumbnail from 'image-thumbnail';

import fileQueue from './utils/fileQueue';
import userQueue from './utils/userQueue';

fileQueue.process(async (job, done) => {
  const { fileId, userId } = job.data;

  if (!fileId) return done(new Error('Missing fileId'));
  if (!userId) return done(new Error('Missing userId'));

  const file = await dbClient.filesCollection.findOne({ _id: new ObjectId(fileId), userId: new ObjectId(userId) });
  if (!file) return done(new Error('File not found'));

  const sizes = [500, 250, 100];
  try {
    await Promise.all(sizes.map(async (size) => {
      const thumbnail = await imageThumbnail(file.localPath, { width: size });
      fs.writeFileSync(`${file.localPath}_${size}`, thumbnail);
    }));
  } catch (err) {
    console.error('Thumbnail error:', err.message);
  }

  done();
});

userQueue.process(async (job, done) => {
  const { userId } = job.data;

  if (!userId) return done(new Error('Missing userId'));

  const user = await dbClient.usersCollection.findOne({ _id: new ObjectId(userId) });
  if (!user) return done(new Error('User not found'));

  console.log(`Welcome ${user.email}!`);

  done();
});
