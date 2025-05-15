const { Queue } = require('bullmq');
const analysisQueue = new Queue('analysis', { connection: { host: 'localhost', port: 6379 } });

exports.enqueueAnalysisJob = async (data) => {
  return await analysisQueue.add('llm-analysis', data);
};