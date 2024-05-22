const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const message = error.details[0].message;
      res.status(400).json({ message });
      return;
    }
    next();
  };
};

module.exports = validateBody;
