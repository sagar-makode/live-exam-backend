const fs = require('fs');

const errorLogger = (err, req, res, next) => {
    // Log the error to a file
    fs.appendFile('error.log', `${new Date().toISOString()}: ${err.message}\n`, (error) => {
        if (error) {
            console.error('Error writing to error log:', error);
        }
    });
    
    // Send error response to the client
    res.status(err.status || 500).json({ error: err.message });
};

module.exports = errorLogger;
