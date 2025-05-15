const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fileStore = require('../models/fileStore');

exports.classifyAndAssign = (file) => {
  const ext = path.extname(file.originalname).toLowerCase();
  let type = 'other';

  if (file.originalname.toLowerCase().includes('resume')) {
    type = 'resume';
  } else if (file.originalname.toLowerCase().includes('vacancy')) {
    type = 'vacancy';
  }

  const fileId = `${type.substring(0, 3)}_${uuidv4()}`;
  return { type, fileId };
};

exports.saveMetadata = (file, type, fileId, extractedText) => {
  fileStore.addFile({
    fileId,
    type,
    filename: file.originalname,
    path: file.path,
    mimeType: file.mimetype,
    extractedText,
    uploadedAt: new Date().toISOString(),
  });
};
