const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const analyzeController = require('../controllers/analyzeController');
const resultController = require('../controllers/resultController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.array('files'), uploadController.handleUpload);
router.post('/analyze', analyzeController.handleAnalysisRequest);
router.get('/result/:jobId', resultController.handleGetResult);

module.exports = router;
