/**
 * Middleware to restrict mutating actions (CREATE, UPDATE, DELETE) for demo accounts.
 * Allows demo users to browse, view, and read all features without modifying shared demo data.
 */
export const restrictDemo = (req, res, next) => {
  if (req.user?.role === "DEMO") {
    return res.status(403).json({
      message: "Demo account is in view-only mode. Please create a free account to add, edit, or delete items!",
    });
  }
  next();
};
