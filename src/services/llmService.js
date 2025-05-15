const { OpenAI } = require('openai');
const axios = require('axios');
const promptTemplates = require('../utils/promptTemplates');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.runLLMAnalysis = async (resumeText, vacancyText, model) => {
  const prompt = promptTemplates.hrPrompt(vacancyText, resumeText);

  if (model.startsWith('openai')) {
    const response = await openai.chat.completions.create({
      model: model.split(':')[1],
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800
    });
    return response.choices[0].message.content;
  }

  if (model.startsWith('groq')) {
    const groqResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: model.split(':')[1],
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return groqResponse.data.choices[0].message.content;
  }

  throw new Error(`Unsupported model: ${model}`);
};
