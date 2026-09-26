import jwt from "jsonwebtoken";

// This function runs BEFORE a protected route's controller.
// It checks if the request includes a valid token, and if so, lets it through.
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Tokens are sent as: "Authorization: Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1]; // grabs the part after "Bearer "

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach the user's info (id, role) to the request for later use
    next(); // token is valid — proceed to the actual route handler
  } catch (error) {
    res.status(401).json({ success: false, message: "Not authorized, invalid token" });
  }
};

// This function runs AFTER protect(), and checks the user's role specifically.
// Use it on routes that only admins should access.
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access only" });
  }
  next();
};