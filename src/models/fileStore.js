require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { createClient } = require('redis');

// Check .env setting to determine storage mode
const USE_REDIS = process.env.FILE_STORE_MODE === 'redis';
console.log('[fileStore] USE_REDIS:', USE_REDIS);
const REDIS_KEY_PREFIX = 'filestore:';
const storePath = path.resolve(__dirname, '../../uploads/fileStore.json');

// ---------------- File store fallback ----------------
function loadStore() {
  if (!fs.existsSync(storePath)) {
    fs.writeFileSync(storePath, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(storePath));
}

function saveStore(data) {
  fs.writeFileSync(storePath, JSON.stringify(data, null, 2));
}

// ---------------- Redis client ----------------
let redisClient = null;
if (USE_REDIS) {
  redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379
    }
  });
  redisClient.on('connect', () => console.log('[fileStore] Connected to Redis'));
  redisClient.on('error', (err) => console.error('[fileStore] Redis error:', err));
  redisClient.connect().catch(console.error);
}

// ---------------- Unified store interface ----------------
exports.addFile = async (fileMeta) => {
  if (USE_REDIS) {
    await redisClient.set(`${REDIS_KEY_PREFIX}${fileMeta.fileId}`, JSON.stringify(fileMeta));
    console.log(`[fileStore] Saved file ${fileMeta.fileId} to Redis`);
  } else {
    const store = loadStore();
    store[fileMeta.fileId] = fileMeta;
    saveStore(store);
    console.log(`[fileStore] Saved file ${fileMeta.fileId} to file`);
  }
};

exports.getTextsByIds = async (ids) => {
  if (USE_REDIS) {
    const results = [];
    for (const id of ids) {
      const data = await redisClient.get(`${REDIS_KEY_PREFIX}${id}`);
      if (!data) throw new Error(`File not found in Redis: ${id}`);
      const parsed = JSON.parse(data);
      results.push({ fileId: parsed.fileId, text: parsed.extractedText });
    }
    return results;
  } else {
    const store = loadStore();
    return ids.map((id) => {
      if (!store[id]) throw new Error(`File not found: ${id}`);
      return { fileId: store[id].fileId, text: store[id].extractedText };
    });
  }
};
