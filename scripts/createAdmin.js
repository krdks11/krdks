require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');

const createAdminUser = async () => {
    try {
        await connectDB();
        
        // Check if admin already exists
        const adminExists = await User.findOne({ username: 'admin' });
        if (adminExists) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const admin = new User({
            username: 'admin',
            password: 'admin123', // This will be hashed automatically
            isAdmin: true
        });

        await admin.save();
        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdminUser();
