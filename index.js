const dotenv = require('dotenv').config();
const app = require('./app');
const PORT = process.env.port || 5000;

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
