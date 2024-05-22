const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "fail",
    code: err.status || 500,
    message: err.message,
    data: "Internal Server Error",
  });
};

module.exports = errorHandler;
