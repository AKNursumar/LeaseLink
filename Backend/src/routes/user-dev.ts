import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Simple auth middleware for development
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'No token provided',
      message: 'Authentication required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_key') as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid token',
      message: 'Token is invalid or expired'
    });
  }
};

// Get current user profile
router.get('/me', authenticateToken, (req: any, res: any) => {
  res.json({
    success: true,
    data: {
      id: req.user.userId,
      email: req.user.email,
      fullName: req.user.fullName || 'Development User',
      role: req.user.role || 'user',
      isVerified: true
    }
  });
});

// Update user profile
router.put('/me', authenticateToken, (req: any, res: any) => {
  const { fullName, phone } = req.body;
  
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      id: req.user.userId,
      email: req.user.email,
      fullName: fullName || 'Development User',
      phone: phone || '',
      role: req.user.role || 'user',
      isVerified: true
    }
  });
});

// Get user rentals
router.get('/rentals', authenticateToken, (req: any, res: any) => {
  res.json({
    success: true,
    data: {
      rentals: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0
      }
    }
  });
});

export default router;
