require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');

const updateAdminPassword = async () => {
    try {
        await connectDB();
        
        // Update admin user with new password
        const admin = await User.findOne({ username: 'admin' });
        if (!admin) {
            console.log('Admin user not found');
            process.exit(1);
        }

        // Set new password
        admin.password = 'YourNewSecurePassword123!'; // Change this to your desired password
        await admin.save();

        console.log('Admin password updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error updating admin password:', error);
        process.exit(1);
    }
};

updateAdminPassword();
