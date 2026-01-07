const validate = (schema) => (req, res, next) => {
  try {
    const input = { body: req.body, query: req.query, params: req.params };
    schema.parse(input);
    return next();
  } catch (err) {
    return res.status(400).json({
      message: "Validation error",
      errors: err.errors?.map((e) => e.message) ?? [],
    });
  }
};

module.exports = validate;
