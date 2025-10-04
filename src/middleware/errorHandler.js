// error 404 
const notFound = (req, res, next) => {
  // API != Vistas
  const isApi = req.originalUrl.startsWith('/api/');
  if (isApi) {
    return res.status(404).json({ status: 'error', message: 'Not found' });
  }
  return res.status(404).render('errors/404', { title: '404 — Not Found' });
};

// 500 - Error interno del servidor
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  if (req.originalUrl.startsWith('/api/')) {
    return res.status(500).json({ status: 'error', message: err.message || 'Error interno del servidor' });
  }
  return res.status(500).render('errors/500', { title: 'Error interno', message: err.message });
};

module.exports = { notFound, errorHandler };