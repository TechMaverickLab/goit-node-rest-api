const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connection successful');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

const originalInvalidate = mongoose.Document.prototype.invalidate;
mongoose.Document.prototype.invalidate = function(path, errorMsg, val, kind) {
  console.log('Document invalidate called. Path:', path, 'Value:', val, 'Error:', errorMsg);
  originalInvalidate.call(this, path, errorMsg, val, kind);
};

module.exports = connectDB;
