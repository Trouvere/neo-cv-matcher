const jobs = {};

exports.saveJobResult = async (jobId, results) => {
  jobs[jobId] = { status: 'done', result: results };
};

exports.getJobStatus = async (jobId) => {
  if (!jobs[jobId]) {
    return { status: 'processing' };
  }
  return jobs[jobId];
};
