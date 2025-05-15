exports.hrPrompt = (vacancy, resume) => `
You are an HR specialist. Compare the following resume to the job vacancy.

Job Vacancy:
${vacancy}

Resume:
${resume}

Answer:
1. Suitability score out of 100
2. Matched requirements
3. Missing qualifications
4. Should this candidate be invited for an interview?
`;
