const mongoose = require("mongoose");

const schema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, select: false},
    firstName: {type: String},
    lastName: {type: String},
    is_active: {type: Boolean, default: true}
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

module.exports = mongoose.model("users", schema);