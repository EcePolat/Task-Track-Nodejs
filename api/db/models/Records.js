const mongoose = require("mongoose");
const Enum = require("../../config/Enum");

const schema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: false},
    status: {type: String, enum: Object.values(Enum.RECORD_STATUS), default: Enum.RECORD_STATUS.OPEN},
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

module.exports = mongoose.model("records", schema);