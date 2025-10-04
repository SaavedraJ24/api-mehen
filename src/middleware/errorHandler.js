module.exports = (err, req, res, _next) => {
  res.status(500).json({ status:'error', message: err.message || 'Internal Server Error' });
};
