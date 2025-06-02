import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const generateToken = (id, fullName, password) => jwt.sign({ id, fullName, password }, JWT_SECRET, { expiresIn: "20s" });

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "There is no token" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "The token is invalid" });
  }
};

export const validateUserId = (req, res, next) => {

  const requestedId = req.params.userId;
  const authenticatedId = req.user.id;
  if (requestedId != authenticatedId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  next();
};