const mongoose = require('mongoose');
const app = require('../server.js');

// Cache the connection promise so we don't reconnect on every warm invocation
let connectionPromise = null;

const connectOnce = () => {
    if (connectionPromise) return connectionPromise;

    connectionPromise = mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        bufferCommands: true,
    }).catch(err => {
        // Reset so next request can try again
        connectionPromise = null;
        throw err;
    });

    return connectionPromise;
};

module.exports = async (req, res) => {
    try {
        // Wait for DB to be ready before handling any request
        if (mongoose.connection.readyState !== 1) {
            await connectOnce();
        }
    } catch (err) {
        console.error('DB Connection failed:', err.message);
        return res.status(503).json({ message: 'Database unavailable', error: err.message });
    }

    return app(req, res);
};
