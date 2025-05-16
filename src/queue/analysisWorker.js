require("dotenv").config();
const { Worker } = require("bullmq");
const fileStore = require("../models/fileStore");
const jobStore = require("../models/jobStore");
const llmService = require("../services/llmService");

const analysisWorker = new Worker(
  "analysis",
  async (job) => {
    console.log(`⚙ [Worker] Processing jobId: ${job.id}...`);
    try {
      const { resumeIds, vacancyIds } = job.data;
      const resumes = await fileStore.getTextsByIds(resumeIds);
      const vacancies = await fileStore.getTextsByIds(vacancyIds);

      const results = [];

      for (const resume of resumes) {
        for (const vacancy of vacancies) {
          console.log(
            `🔗 [Worker] Analyzing ${resume.fileId} vs ${vacancy.fileId} using gpt-3.5-turbo`
          );
          try {
            const result = await llmService.runLLMAnalysis(
              resume.text,
              vacancy.text
            );
            results.push({
              resumeId: resume.fileId,
              vacancyId: vacancy.fileId,
              modelUsed: "openai:gpt-3.5-turbo",
              result,
            });
          } catch (llmError) {
            console.error(`❌ [Worker] LLM error: ${llmError.message}`);
            results.push({
              resumeId: resume.fileId,
              vacancyId: vacancy.fileId,
              modelUsed: "openai:gpt-3.5-turbo",
              result: `[Error] ${llmError.message}`,
            });
          }
        }
      }

      await jobStore.saveJobResult(job.id, results);
      console.log(`✅ [Worker] Job ${job.id} completed and result saved`);
    } catch (error) {
      console.error(`❌ [Worker] Job ${job.id} failed:`, error);
      await jobStore.saveJobResult(job.id, { error: error.message });
    }
  },
  { connection: { host: "localhost", port: 6379 } }
);

console.log("🚀 [Worker] Started and listening for jobs...");
analysisWorker.on("completed", (job) =>
  console.log(`✅ Job ${job.id} completed globally`)
);
analysisWorker.on("failed", (job, err) =>
  console.error(`❌ Job ${job.id} failed globally: ${err.message}`)
);
analysisWorker.on("error", (err) =>
  console.error(`❌ Worker internal error: ${err.message}`)
);
