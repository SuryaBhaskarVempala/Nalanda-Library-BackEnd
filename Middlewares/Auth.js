const jwt = require("jsonwebtoken");


//Generate Token With Payload :
const getToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1W" });
};

const authCheck = (token) => {
  console.log(token);
  console.log(process.env.JWT_SECRET)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded:", payload);
    return payload;
  } catch (err) {
    console.error("JWT error:", err.message);
    throw err;
  }

};


//Role Based Auth (It Gives Access For the EndPoint Based on the Role)
const protectedRoutes = (roles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader +" : authHeader")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = authCheck(token);
      req.user = decoded;

      if (roles.includes(req.user.role)) {
        return next();
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};


//only can Admin Access those Routes or Endpoints
const adminOnly = protectedRoutes(["Admin"]);

//Admin & Members can Access those Routes or Endpoints
const adminOrMember = protectedRoutes(["Admin", "Member"]);

module.exports = { getToken, adminOnly, adminOrMember, authCheck };
