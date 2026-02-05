const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    expires_at: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("refresh_tokens", schema);