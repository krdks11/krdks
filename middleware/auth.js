const jwt = require('jsonwebtoken');

// Set JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-temporary-secret-key-123';

const auth = (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.token;
        console.log('Token found in cookies:', !!token);

        // Check if no token
        if (!token) {
            console.log('No token found, redirecting to login');
            return res.redirect('/admin/login');
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);
            console.log('Token verified successfully');
            req.user = decoded.user;
            next();
        } catch (err) {
            console.error('Token verification failed:', err.message);
            res.clearCookie('token');
            res.redirect('/admin/login');
        }
    } catch (err) {
        console.error('Auth middleware error:', err);
        res.status(500).send('Server Error');
    }
};

module.exports = auth;
