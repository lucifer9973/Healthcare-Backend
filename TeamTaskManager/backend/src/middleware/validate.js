function validate(schema, property = 'body') {
  return function validateRequest(req, res, next) {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: result.error.issues[0]?.message || 'Invalid request'
        }
      });
    }

    req[property] = result.data;
    next();
  };
}

module.exports = { validate };
