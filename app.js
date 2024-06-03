const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const passport = require('passport');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use('/avatars', express.static(path.join(__dirname, 'public/avatars')));

app.use(bodyParser.json({ strict: true }));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ status: 'fail', code: 400, message: 'Invalid JSON' });
  }
  next();
});

const routerApi = require('./routes/contacts');
const routerUsers = require('./routes/users');

app.use('/api/contacts', routerApi);
app.use('/api/users', routerUsers);

const errorHandler =
  process.env.NODE_ENV === 'test'
    ? require('./middlewares/errorHandler.js.test')
    : require('./middlewares/errorHandler');

app.use(errorHandler);

app.use((_, res) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Use api on routes: /api/contacts',
    data: 'Not found',
  });
});

app.use((err, _, res, __) => {
  console.log(err.stack);
  res.status(500).json({
    status: 'fail',
    code: 500,
    message: err.message,
    data: 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
});

module.exports = app;
