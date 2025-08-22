// backend/src/middleware/auth.js
import jwt from "jsonwebtoken";

// Middleware to verify the JWT and protect routes
export default (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token required" });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify the token and attach the user payload to the request
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};