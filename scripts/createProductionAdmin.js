require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
    try {
        // Connect to production database
        const mongoURI = process.env.MONGODB_URI;
        console.log('Connecting to:', mongoURI);
        
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('Connected to MongoDB');

        // Delete existing admin if exists
        await User.deleteOne({ username: 'admin' });
        console.log('Deleted existing admin if any');

        // Create new admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = new User({
            username: 'admin',
            password: hashedPassword,
            isAdmin: true
        });

        await admin.save();
        console.log('New admin user created successfully');

        // Verify the user exists
        const savedAdmin = await User.findOne({ username: 'admin' });
        console.log('Admin user found in database:', !!savedAdmin);
        
        // Test password
        const isValidPassword = await bcrypt.compare('admin123', savedAdmin.password);
        console.log('Password verification:', isValidPassword);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin();
