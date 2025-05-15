const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const tesseract = require('tesseract.js');
const fs = require('fs');

exports.extractText = async (file) => {
  const ext = file.originalname.split('.').pop().toLowerCase();

  if (ext === 'pdf') {
    const dataBuffer = fs.readFileSync(file.path);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  if (ext === 'docx') {
    const data = await mammoth.extractRawText({ path: file.path });
    return data.value;
  }

  if (['jpg', 'jpeg', 'png'].includes(ext)) {
    const { data: { text } } = await tesseract.recognize(file.path, 'eng');
    return text;
  }

  if (ext === 'txt') {
    return fs.readFileSync(file.path, 'utf8');
  }

  return '[Unsupported format]';
};
