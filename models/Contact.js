const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    mobile: {
        type: String,
        required: [true, 'Mobile number is required'],
        trim: true
    },
    projectType: {
        type: String,
        required: [true, 'Project type is required'],
        trim: true
    },
    budget: {
        type: String,
        required: [true, 'Budget range is required'],
        trim: true
    },
    timeline: {
        type: String,
        required: [true, 'Timeline is required'],
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Project details are required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-review', 'contacted', 'completed'],
        default: 'pending'
    },
    submission_date: {
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
