require('dotenv').config();
const { createClient } = require('redis');

const REDIS_KEY_PREFIX = 'job-result:';
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379
  }
});

(async () => {
  try {
    await redisClient.connect();
    console.log('[debugJobStore] Connected to Redis');

    const keys = await redisClient.keys(`${REDIS_KEY_PREFIX}*`);
    if (keys.length === 0) {
      console.log('[debugJobStore] No job results found in Redis.');
      process.exit(0);
    }

    console.log(`[debugJobStore] Found ${keys.length} job results:`);
    for (const key of keys) {
      const data = await redisClient.get(key);
      console.log(`\n🔑 ${key}:\n${data}`);
    }

    await redisClient.disconnect();
  } catch (err) {
    console.error('[debugJobStore] Error:', err);
  }
})();
