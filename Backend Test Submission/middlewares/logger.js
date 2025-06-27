const winston = require("winston");

const logger = winston.createLogger({
    transports: [
        new  winston.transports.Console(),
        new winston.transports.File({ filename: "logs/app.log" })
    ]
});

module.exports = (req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl} ${new Date().toISOString()}`);
    next();
};