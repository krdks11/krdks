require('dotenv').config();

console.log('Environment Variables:');
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);
