const winston = require("winston");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.prettyPrint()
    })
  ]
});

module.exports = logger