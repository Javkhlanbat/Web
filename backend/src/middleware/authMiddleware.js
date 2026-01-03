const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        error: 'Нэвтрэх шаардлагатай',
        message: 'Токен олдсонгүй'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Буруу токен',
      message: 'Токен хүчингүй байна'
    });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({
      error: 'Эрхгүй',
      message: 'Админ эрх шаардлагатай'
    });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
