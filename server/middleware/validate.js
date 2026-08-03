// Zod validation middleware factory
// Usage: router.post("/", validate(myZodSchema), controller)
export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    next(err); // Passes ZodError to errorHandler
  }
};
