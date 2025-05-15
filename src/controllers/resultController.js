const jobStore = require('../models/jobStore');

exports.handleGetResult = async (req, res) => {
  const jobId = req.params.jobId;
  const status = await jobStore.getJobStatus(jobId);
  res.json(status);
};
