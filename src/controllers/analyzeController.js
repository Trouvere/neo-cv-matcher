const queueService = require('../services/queueService');

exports.handleAnalysisRequest = async (req, res) => {
  try {
    const { resumeIds, vacancyIds, models, all } = req.body;

    if (!resumeIds || !vacancyIds) {
      return res.status(400).json({ error: 'resumeIds and vacancyIds are required' });
    }

    const job = await queueService.enqueueAnalysisJob({ resumeIds, vacancyIds, models, all });
    res.json({ jobId: job.id });
  } catch (error) {
    console.error('Analysis Request Error:', error);
    res.status(500).json({ error: 'Failed to enqueue analysis job' });
  }
};
