import jwt from "jsonwebtoken";
export const isUser = (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.cookies?.Token || req.cookies?.authToken;
    const role = req.cookies?.role;

    if (!token) return res.status(401).json({ message: "No token provided" });
    if (!role) return res.status(403).json({ message: "No role provided" });

    const secret = process.env.JWT_SECRET;
    if (!secret)
      return res.status(500).json({ message: "JWT secret not configured" });

    const payload = jwt.verify(token, secret);


    req.userId = payload.userId;
    if (role !== "student" && role !== "user")
      return res
        .status(403)
        .json({ message: "Forbidden: student role required" });
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: err.message });
  }
};

export const isTeacher = (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.cookies?.Token || req.cookies?.authToken;
    const role = req.cookies?.role;

    if (!token) return res.status(401).json({ message: "No token provided" });
    if (!role) return res.status(403).json({ message: "No role provided" });

    const secret = process.env.JWT_SECRET;
    if (!secret)
      return res.status(500).json({ message: "JWT secret not configured" });

    const payload = jwt.verify(token, secret);

    req.userId = payload.userId;

    if (role !== "teacher")
      return res
        .status(403)
        .json({ message: "Forbidden: teacher role required" });
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: err.message });
  }
};

export default { isUser, isTeacher };
