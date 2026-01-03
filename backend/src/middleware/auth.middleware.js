const jwt = require("jsonwebtoken");
const db = require("../config/db");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // check blacklist
    const blacklisted = await db.query(
      "SELECT 1 FROM token_blacklist WHERE token = $1",
      [token]
    );

    if (blacklisted.rowCount > 0) {
      return res.status(401).json({ message: "Token revoked" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔴 THIS WAS MISSING
    req.user = {
        userId: decoded.userId || decoded.user_id,
        tenantId: decoded.tenantId || decoded.tenant_id,
        role: decoded.role
    };


    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
