const express = require('express');
const apiRoutes = require('./src/routes/apiRoutes');
require('dotenv').config();
console.log('[API] FILE_STORE_MODE:', process.env.FILE_STORE_MODE);

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));