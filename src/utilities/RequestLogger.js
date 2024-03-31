const fs = require('fs');

const requestLogger = (req, res, next) => {
    // Log the request details to a file
    fs.appendFile('requests.log', `${new Date().toISOString()}: ${req.method} ${req.url}\n`, (error) => {
        if (error) {
            console.error('Error writing to request log:', error);
        }
    });
    
    // Move to the next middleware
    next();
};

module.exports = requestLogger;
