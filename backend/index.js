import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 3000;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

process.on('unhandledRejection', (err, promise) => {
    console.error(`Logged Error: ${err.message}`);
});
