const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || '';

module.exports = {
  PORT,
  paths: {
    public: path.join(__dirname, '../../public'),
    views: path.join(__dirname, '../views'),
  },
  MONGO_URI,
};
