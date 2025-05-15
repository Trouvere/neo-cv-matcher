const { Worker } = require('bullmq');
const fileStore = require('../models/fileStore');
const jobStore = require('../models/jobStore');
const llmService = require('../services/llmService');

new Worker('analysis', async (job) => {
  const { resumeIds, vacancyIds, models, all } = job.data;

  const resumes = fileStore.getTextsByIds(resumeIds);
  const vacancies = fileStore.getTextsByIds(vacancyIds);
  const selectedModels = all ? ['openai:gpt-4', 'groq:llama3-8b'] : models;

  const results = [];

  for (const resume of resumes) {
    for (const vacancy of vacancies) {
      for (const model of selectedModels) {
        const result = await llmService.runLLMAnalysis(resume.text, vacancy.text, model);
        results.push({ resumeId: resume.fileId, vacancyId: vacancy.fileId, model, result });
      }
    }
  }

  await jobStore.saveJobResult(job.id, results);
}, { connection: { host: 'localhost', port: 6379 } });
