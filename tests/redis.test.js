import redisClient from '../utils/redis';
import { expect } from 'chai';

describe('Redis Client', () => {
  it('should be alive', () => {
    expect(redisClient.isAlive()).to.be.true;
  });

  it('should set and get a key', async () => {
    await redisClient.set('myTestKey', 'testValue', 5);
    const value = await redisClient.get('myTestKey');
    expect(value).to.equal('testValue');
  });
});
