const fileService = require('../services/fileService');
const extractService = require('../services/extractService');

exports.handleUpload = async (req, res) => {
  const processedFiles = await Promise.all(
    req.files.map(async (file) => {
      const { type, fileId } = fileService.classifyAndAssign(file);
      const text = await extractService.extractText(file);
      fileService.saveMetadata(file, type, fileId, text);
      return { type, filename: file.originalname, fileId };
    })
  );
  res.json(processedFiles);
};
