const rateLimit = require("express-rate-limit");

module.exports = rateLimit({
    windowMs: 1*60*1000,
    max: 5,
    message: {
        error: "Too many login attempts. Try again later."
    }
});