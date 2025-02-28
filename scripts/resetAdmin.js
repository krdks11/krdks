require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');

const resetAdminUser = async () => {
    try {
        await connectDB();
        
        // Delete existing admin
        await User.deleteOne({ username: 'admin' });
        console.log('Deleted existing admin user');

        // Create new admin user
        const admin = new User({
            username: 'admin',
            password: 'admin123',
            isAdmin: true
        });

        await admin.save();
        console.log('New admin user created successfully');
        
        // Verify the user exists and password works
        const savedAdmin = await User.findOne({ username: 'admin' });
        const isValidPassword = await savedAdmin.comparePassword('admin123');
        console.log('Password verification:', isValidPassword);

        process.exit(0);
    } catch (error) {
        console.error('Error resetting admin user:', error);
        process.exit(1);
    }
};

resetAdminUser();
