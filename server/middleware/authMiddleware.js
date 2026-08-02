import jwt from "jsonwebtoken";

const authMiddleware = (
  req,
  res,
  next
) => {

  try {

    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token =
      authHeader.split(" ")[1];

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    req.user = decoded;

    // Restrict mutations in DEMO mode
    if (req.user.role === "DEMO" && req.method !== "GET") {
      return res.status(403).json({
        message: "Action disabled in Demo mode. Register for an account to use all features!",
      });
    }

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid token",
    });

  }
};

export default authMiddleware;