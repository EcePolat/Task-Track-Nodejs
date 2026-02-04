const mongoose = require("mongoose");

const schema = mongoose.Schema({

    name: { type: String, required: true, unique: true},
    permissions: { type: [String], required: true},
}, {
    timestamps: true
});

module.exports = mongoose.model("roles", schema);