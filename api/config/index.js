module.exports = {
    "PORT": process.env.PORT || "3000",
    "CONNECTION_STRING": process.env.CONNECTION_STRING || "mongodb://127.0.0.1:27017/task-track",
    "JWT": {
        "SECRET": process.env.JWT_SECRET,
        "REFRESH_SECRET": process.env.JWT_REFRESH_SECRET,
        "ACCESS_EXPIRE": process.env.ACCESS_TOKEN_EXPIRE,
        "REFRESH_EXPIRE": process.env.REFRESH_TOKEN_EXPIRE
    }
}