const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const pool = require('./config/database');

// Comment out this line temporarily
// const basicAuth = require('express-basic-auth');

const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// EJS setup
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');

// Comment out the auth middleware temporarily
/*
const adminAuth = basicAuth({
    users: { 'admin': 'your_secure_password' },
    challenge: true,
    realm: 'Portfolio Admin Panel'
});
*/

// Update the admin route to remove auth temporarily
app.get('/admin/submissions', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM contact_submissions ORDER BY submission_date DESC');
        res.render('admin/submissions', { submissions: rows });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).send('Error fetching submissions');
    }
});

// View single submission
app.get('/admin/submissions/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM contact_submissions WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).send('Submission not found');
        }
        res.render('admin/view-submission', { submission: rows[0] });
    } catch (error) {
        console.error('Error fetching submission:', error);
        res.status(500).send('Error fetching submission');
    }
});

// Update submission status
app.post('/admin/submissions/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        await pool.query(
            'UPDATE contact_submissions SET status = ? WHERE id = ?',
            [status, req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ success: false });
    }
});

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/portfolio', (req, res) => {
    res.render('portfolio');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/project/:id', (req, res) => {
    // You can store project data in a separate file or database
    const projects = {
        'aljmweb': {
            title: 'ALJMWEB',
            description: 'First Web Development Project - A responsive website showcasing modern web design principles.',
            longDescription: 'A comprehensive website built with modern web technologies, featuring responsive design, interactive elements, and smooth animations.',
            technologies: ['HTML', 'CSS', 'JavaScript'],
            screenshots: ['/images/aljmweb/screenshot1.jpg', '/images/aljmweb/screenshot2.jpg'],
            liveLink: 'https://aljmweb.com',
            githubLink: 'https://github.com/krdks11/ALJMWEB',
            type: 'website'
        },
        'portfolio': {
            title: 'Personal Portfolio',
            description: 'Modern portfolio website built with Express.js and EJS templating.',
            longDescription: 'A modern, responsive portfolio website built using Express.js and EJS templating. Features include dark/light mode, smooth animations, and project showcases.',
            technologies: ['Express.js', 'EJS', 'CSS', 'JavaScript'],
            screenshots: ['/images/portfolio/home.jpg', '/images/portfolio/projects.jpg'],
            liveLink: 'https://your-portfolio-url.com',
            githubLink: 'https://github.com/krdks11/portfolio',
            type: 'website',
            features: [
                'Responsive Design',
                'Dark/Light Mode',
                'Project Showcase',
                'Contact Form',
                'Smooth Animations'
            ]
        },
        'snake-ladder': {
            title: 'Snake & Ladder Game',
            description: 'Classic Snake and Ladder game implemented with modern web technologies.',
            longDescription: 'A modern take on the classic Snake and Ladder game, featuring interactive gameplay, animations, and multiplayer support.',
            technologies: ['HTML', 'CSS', 'JavaScript'],
            screenshots: ['/images/snake-ladder/gameplay.jpg', '/images/snake-ladder/menu.jpg'],
            liveLink: 'https://snake-ladder-game.com',
            githubLink: 'https://github.com/krdks11/snake-ladder',
            type: 'game',
            howToPlay: 'Roll the dice by clicking, move your piece automatically, and reach 100 to win!'
        },
        'currency-converter': {
            title: 'Currency Converter',
            description: 'Cross-platform currency conversion app built with Flutter.',
            longDescription: 'A powerful cross-platform currency conversion application built with Flutter and Dart. Features real-time exchange rates, multiple currency support, and offline functionality.',
            technologies: ['Flutter', 'Dart', 'Exchange Rate API', 'Firebase'],
            screenshots: ['/images/currency-converter/main.jpg', '/images/currency-converter/conversion.jpg'],
            appLinks: {
                android: 'https://play.google.com/store/apps/currency-converter',
                ios: 'https://apps.apple.com/app/currency-converter'
            },
            githubLink: 'https://github.com/krdks11/currency-converter',
            type: 'app',
            features: [
                'Real-time Exchange Rates',
                'Multiple Currency Support',
                'Offline Mode',
                'Currency History Charts',
                'Favorite Currencies',
                'Dark/Light Theme'
            ]
        },
        'weather-app': {
            title: 'Weather Application',
            description: 'Cross-platform weather app developed with Flutter.',
            longDescription: 'A comprehensive weather application built with Flutter and Dart, providing detailed weather information, forecasts, and weather alerts across multiple platforms.',
            technologies: ['Flutter', 'Dart', 'Weather API', 'Firebase'],
            screenshots: ['/images/weather-app/dashboard.jpg', '/images/weather-app/forecast.jpg'],
            appLinks: {
                android: 'https://play.google.com/store/apps/weather-app',
                ios: 'https://apps.apple.com/app/weather-app'
            },
            githubLink: 'https://github.com/krdks11/weather-app',
            type: 'app',
            features: [
                'Real-time Weather Updates',
                '7-day Forecast',
                'Weather Alerts',
                'Location-based Weather',
                'Multiple Locations',
                'Weather Maps',
                'Dark/Light Theme'
            ]
        }
    };

    const project = projects[req.params.id];
    if (!project) {
        return res.status(404).render('404');
    }

    res.render('project-detail', { project });
});

// Add this route to handle form submissions
app.post('/submit-form', async (req, res) => {
    try {
        const { name, email, projectType, budget, timeline, message } = req.body;
        
        const query = `
            INSERT INTO contact_submissions 
            (full_name, email, project_type, budget_range, timeline, project_details)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        await pool.execute(query, [name, email, projectType, budget, timeline, message]);
        
        res.json({ success: true, message: 'Form submitted successfully!' });
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).json({ success: false, message: 'Error submitting form' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 