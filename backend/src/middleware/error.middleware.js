export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'MongooseServerSelectionError') {
    return res.status(500).json({
      message: 'Database connection error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}; 