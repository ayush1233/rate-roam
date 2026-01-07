// Central error handler
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);

  if (res.headersSent) {
    return;
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal server error" });
};

module.exports = errorHandler;
