const files = {};

exports.addFile = (fileMeta) => {
  files[fileMeta.fileId] = fileMeta;
};

exports.getTextsByIds = (ids) => {
  return ids.map(id => {
    const file = files[id];
    if (!file) throw new Error(`File not found: ${id}`);
    return { fileId: file.fileId, text: file.extractedText };
  });
};
