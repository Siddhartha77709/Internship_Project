import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];

  const jwtSecret = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'shopez_super_secret_jwt_key_123456';
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Contains id and role
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Request is not authorized' });
  }
};

export const requireAdmin = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access forbidden. Admin account required.' });
    }
    next();
  });
};

export const requireUser = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.user.role !== 'USER') {
      return res.status(403).json({ message: 'Access forbidden. Investor account required.' });
    }
    next();
  });
};
