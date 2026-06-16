import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'shopez_super_secret_jwt_key_123456');
    req.user = decoded; // Contains id and role
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Request is not authorized' });
  }
};

export const requireSeller = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Access forbidden. Seller account required.' });
    }
    next();
  });
};

export const requireCustomer = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Access forbidden. Customer account required.' });
    }
    next();
  });
};
