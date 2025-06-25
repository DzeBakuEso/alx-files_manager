// tests/db.test.js
import { expect } from 'chai';
import dbClient from '../utils/db';

describe('MongoDB Client', function () {
  this.timeout(20000); // Set timeout to allow DB to connect

  before(async function () {
    // Wait up to 15 seconds for MongoDB to connect
    const maxWaitTime = 15000;
    const waitInterval = 100;
    let waited = 0;

    while (!dbClient.isAlive() && waited < maxWaitTime) {
      await new Promise((resolve) => setTimeout(resolve, waitInterval));
      waited += waitInterval;
    }

    if (!dbClient.isAlive()) {
      throw new Error('MongoDB did not connect in time');
    }
  });

  it('should be alive', () => {
    expect(dbClient.isAlive()).to.be.true;
  });

  it('should return a number for users and files', async () => {
    const nbUsers = await dbClient.nbUsers();
    const nbFiles = await dbClient.nbFiles();
    expect(nbUsers).to.be.a('number');
    expect(nbFiles).to.be.a('number');
  });
});
