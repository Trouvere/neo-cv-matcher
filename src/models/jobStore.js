const fs = require('fs');
const path = require('path');
const { createClient } = require('redis');

const USE_REDIS = process.env.JOB_STORE_MODE === 'redis';
const REDIS_KEY_PREFIX = 'job-result:';
const storePath = path.resolve(__dirname, '../../uploads/jobStore.json');

let redisClient = null;
if (USE_REDIS) {
  redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379
    }
  });
  redisClient.on('connect', () => console.log('[jobStore] Connected to Redis'));
  redisClient.on('error', (err) => console.error('[jobStore] Redis error:', err));
  redisClient.connect().catch(console.error);
}

exports.saveJobResult = async (jobId, result) => {
  if (USE_REDIS) {
    await redisClient.set(`${REDIS_KEY_PREFIX}${jobId}`, JSON.stringify({ status: 'done', result }));
    console.log(`[jobStore] Saved result to Redis for job ${jobId}`);
  } else {
    const store = loadStore();
    store[jobId] = { status: 'done', result };
    saveStore(store);
    console.log(`[jobStore] Saved result to file for job ${jobId}`);
  }
};

exports.getJobStatus = async (jobId) => {
  if (USE_REDIS) {
    const data = await redisClient.get(`${REDIS_KEY_PREFIX}${jobId}`);
    if (!data) return { status: 'processing' };
    return JSON.parse(data);
  } else {
    const store = loadStore();
    return store[jobId] || { status: 'processing' };
  }
};

function loadStore() {
  if (!fs.existsSync(storePath)) {
    fs.writeFileSync(storePath, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(storePath));
}

function saveStore(data) {
  fs.writeFileSync(storePath, JSON.stringify(data, null, 2));
}
