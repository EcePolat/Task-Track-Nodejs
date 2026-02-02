module.exports = {
    "PORT": process.env.PORT || "3000",
    "CONNECTION_STRING": process.env.CONNECTION_STRING || "mongodb://127.0.0.1:27017/task-track",
    "JWT": {
        "SECRET": process.env.JWT_SECRET,
        "EXPIRE_TIME": Number(process.env.JWT_EXPIRE_TIME) || 86400

    }
}