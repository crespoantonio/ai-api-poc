import winston from 'winston';

// Define the Winston logger configuration
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }), // Log errors to a file
        new winston.transports.File({ filename: './logs/combined.log' }) // Log all levels to a file
    ]
});

export default logger;