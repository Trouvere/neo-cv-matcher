// require('dotenv').config();
// const { OpenAI } = require('openai');
// const promptTemplates = require('../utils/promptTemplates');

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// exports.runLLMAnalysis = async (resumeText, vacancyText) => {
//   const prompt = promptTemplates.hrPrompt(vacancyText, resumeText);

//   try {
//     console.log(`[LLMService] Using fixed model: gpt-3.5-turbo`);
//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [{ role: 'user', content: prompt }],
//       max_tokens: 800
//     });
//     return response.choices[0].message.content;
//   } catch (error) {
//     console.error(`[LLMService] OpenAI API error: ${error.message}`);
//     throw new Error(error.message);
//   }
// };
require('dotenv').config();
const axios = require('axios');
const promptTemplates = require('../utils/promptTemplates');

// Always use Groq LLaMA 3 8B model (free and fast)
exports.runLLMAnalysis = async (resumeText, vacancyText) => {
  const prompt = promptTemplates.hrPrompt(vacancyText, resumeText);

  try {
    console.log(`[LLMService] Using Groq model: llama3-8b-8192`);
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(`[LLMService] Groq API error: ${error.response?.status} ${error.response?.data?.error?.message || error.message}`);
    throw new Error(error.message);
  }
};
