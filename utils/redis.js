import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err.message);
    });

    // Promisify get, setex and del for async/await use
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  /**
   * Check if Redis client is connected
   * @returns {boolean}
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Get value for a given key from Redis
   * @param {string} key
   * @returns {Promise<string | null>}
   */
  async get(key) {
    return this.getAsync(key);
  }

  /**
   * Set value in Redis with an expiration
   * @param {string} key
   * @param {string | number} value
   * @param {number} duration (in seconds)
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    await this.setAsync(key, value, 'EX', duration);
  }

  /**
   * Delete a key in Redis
   * @param {string} key
   * @returns {Promise<void>}
   */
  async del(key) {
    await this.delAsync(key);
  }
}

// Create and export instance
const redisClient = new RedisClient();
export default redisClient;
