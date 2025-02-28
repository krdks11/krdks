const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const Contact = require('./models/Contact');
const User = require('./models/User');
const auth = require('./middleware/auth');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Set JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-temporary-secret-key-123';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// EJS setup
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');

// Connect to MongoDB
connectDB()
    .then(() => {
        console.log('Database connection established');
        
        // Only start the server after successful database connection
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to the database:', err);
        process.exit(1);
    });

// Routes
app.get('/', (req, res) => {
    res.render('index', { currentPage: 'home' });
});

app.get('/about', (req, res) => {
    res.render('about', { currentPage: 'about' });
});

app.get('/portfolio', (req, res) => {
    // Define projects data
    const projects = {
        'aljmweb': {
            title: 'ALJMWEB',
            description: 'First Web Development Project - A responsive website showcasing modern web design principles.',
            screenshots: ['/images/projects/aljmweb/web-development.png'],
            technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express', 'MongoDB'],
            features: [
                'Responsive design that works on all devices',
                'Modern UI/UX principles',
                'Interactive components and animations',
                'Cross-browser compatibility'
            ],
            liveDemo: 'https://aljmweb.herokuapp.com',
            sourceCode: 'https://github.com/yourusername/aljmweb'
        },
        'portfolio': {
            title: 'Portfolio Website',
            description: 'My personal portfolio website built with modern technologies.',
            screenshots: ['/images/projects/portfolio/portfolio-website.png'],
            technologies: ['Node.js', 'Express', 'EJS', 'MongoDB', 'CSS3'],
            features: [
                'Dynamic project showcase',
                'Dark/Light theme toggle',
                'Responsive layout',
                'Contact form with email integration'
            ],
            liveDemo: 'https://yourportfolio.com',
            sourceCode: 'https://github.com/yourusername/portfolio'
        },
        'snake-ladder': {
            title: 'Snake and Ladder Game',
            description: 'A classic Snake and Ladder board game implementation with modern features.',
            screenshots: ['/images/projects/snake-ladder/snake-game.png'],
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'Canvas API'],
            features: [
                'Interactive game board',
                'Multiplayer support',
                'Dice rolling animation',
                'Game state management'
            ],
            liveDemo: 'https://snakeladder.yourdomain.com',
            sourceCode: 'https://github.com/yourusername/snake-ladder'
        },
        'currency-converter': {
            title: 'Currency Converter',
            description: 'A real-time currency conversion tool with support for multiple currencies.',
            screenshots: ['/images/projects/currency-converter/currency-app.png'],
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'Exchange Rate API'],
            features: [
                'Real-time exchange rates',
                'Support for 170+ currencies',
                'Conversion history',
                'Rate alerts and notifications'
            ],
            liveDemo: 'https://currency.yourdomain.com',
            sourceCode: 'https://github.com/yourusername/currency-converter'
        },
        'weather-app': {
            title: 'Weather App',
            description: 'A weather application that provides real-time weather information and forecasts.',
            screenshots: ['/images/projects/weather-app/weather-application.png'],
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'Weather API', 'Geolocation API'],
            features: [
                'Current weather conditions',
                '5-day weather forecast',
                'Location-based weather',
                'Weather alerts and notifications'
            ],
            liveDemo: 'https://weather.yourdomain.com',
            sourceCode: 'https://github.com/yourusername/weather-app'
        }
    };
    
    res.render('portfolio', { projects, currentPage: 'portfolio' });
});

app.get('/contact', (req, res) => {
    res.render('contact', { currentPage: 'contact' });
});

app.get('/project/:id', (req, res) => {
    const projectId = req.params.id;
    
    const projects = {
        'aljmweb': {
            title: 'ALJMWEB',
            description: 'A web development project showcasing modern design and functionality.',
            screenshots: ['/images/aljmweb/web-development.png'],
            technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
            features: [
                'Responsive design for all devices',
                'Modern UI/UX implementation',
                'Interactive components',
                'Performance optimized'
            ],
            liveDemo: 'https://example.com/aljmweb',
            sourceCode: 'https://github.com/yourusername/aljmweb'
        },
        'portfolio': {
            title: 'Portfolio Website',
            description: 'Personal portfolio website to showcase projects and skills.',
            screenshots: ['/images/portfolio/portfolio-website.png'],
            technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express'],
            features: [
                'Clean and modern design',
                'Project showcase',
                'Responsive layout',
                'Dark/Light theme'
            ],
            liveDemo: 'https://example.com/portfolio',
            sourceCode: 'https://github.com/yourusername/portfolio'
        },
        'snake-ladder': {
            title: 'Snake and Ladder Game',
            description: 'Classic Snake and Ladder game with modern features.',
            screenshots: ['/images/snake-ladder/snake-game.png'],
            technologies: ['HTML', 'CSS', 'JavaScript'],
            features: [
                'Interactive gameplay',
                'Multiplayer support',
                'Score tracking',
                'Sound effects'
            ],
            liveDemo: 'https://example.com/snake-ladder',
            sourceCode: 'https://github.com/yourusername/snake-ladder'
        },
        'currency-converter': {
            title: 'Currency Converter',
            description: 'Real-time currency conversion application.',
            screenshots: ['/images/currency-converter/currency-app.png'],
            technologies: ['HTML', 'CSS', 'JavaScript', 'API Integration'],
            features: [
                'Real-time exchange rates',
                'Multiple currency support',
                'Conversion history',
                'Offline support'
            ],
            liveDemo: 'https://example.com/currency-converter',
            sourceCode: 'https://github.com/yourusername/currency-converter'
        },
        'weather-app': {
            title: 'Weather Application',
            description: 'Weather forecast application with detailed information.',
            screenshots: ['/images/weather-app/weather-application.png'],
            technologies: ['HTML', 'CSS', 'JavaScript', 'Weather API'],
            features: [
                'Current weather data',
                '5-day forecast',
                'Location-based weather',
                'Weather alerts'
            ],
            liveDemo: 'https://example.com/weather-app',
            sourceCode: 'https://github.com/yourusername/weather-app'
        }
    };

    const project = projects[projectId];
    
    if (!project) {
        return res.status(404).send('Project not found');
    }
    
    res.render('project-detail', { project });
});

// Admin routes
app.get('/admin/login', (req, res) => {
    res.render('admin/login', { layout: false });
});

app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log('Login attempt for username:', username);

        // Check if user exists
        let user = await User.findOne({ username });
        console.log('User found:', !!user);

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await user.comparePassword(password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                isAdmin: user.isAdmin
            }
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
        
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        console.log('Login successful, token generated');
        res.json({ success: true });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

app.get('/admin/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin/login');
});

// Protected admin routes
app.get('/admin/submissions', auth, async (req, res) => {
    try {
        const submissions = await Contact.find().sort({ submission_date: -1 });
        res.render('admin/submissions', { submissions, currentPage: 'admin' });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).send('Error fetching submissions');
    }
});

app.get('/admin/submissions/:id', auth, async (req, res) => {
    try {
        const submission = await Contact.findById(req.params.id);
        if (!submission) {
            return res.status(404).send('Submission not found');
        }
        res.render('admin/submission-detail', { submission, currentPage: 'admin' });
    } catch (error) {
        console.error('Error fetching submission details:', error);
        res.status(500).send('Error fetching submission details');
    }
});

app.put('/admin/submissions/:id/status', auth, async (req, res) => {
    try {
        const submission = await Contact.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json({ success: true, submission });
    } catch (error) {
        console.error('Error updating submission status:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Handle form submissions
app.post('/submit-form', async (req, res) => {
    try {
        console.log('Received form submission:', req.body);
        
        const { name, email, mobile, projectType, budget, timeline, message } = req.body;
        
        // Validate required fields
        if (!name || !email || !mobile || !projectType || !budget || !timeline || !message) {
            console.error('Missing required fields:', {
                name: !!name,
                email: !!email,
                mobile: !!mobile,
                projectType: !!projectType,
                budget: !!budget,
                timeline: !!timeline,
                message: !!message
            });
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        console.log('Creating new contact document...');
        const newContact = new Contact({
            name,
            email,
            mobile,
            projectType,
            budget,
            timeline,
            message
        });
        
        console.log('Attempting to save contact:', newContact);
        await newContact.save();
        console.log('Contact saved successfully');
        
        res.json({ success: true, message: 'Form submitted successfully!' });
    } catch (error) {
        console.error('Error in form submission:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            success: false, 
            message: 'There was an error submitting the form. Please try again.',
            error: error.message 
        });
    }
});

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        res.status(200).json({ status: 'healthy', database: dbStatus });
    } catch (error) {
        res.status(500).json({ status: 'unhealthy', error: error.message });
    }
});