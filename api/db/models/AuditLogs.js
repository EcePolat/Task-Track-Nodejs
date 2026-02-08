const mongoose = require("mongoose");

const schema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users",
        required: true
    },
    action: {
        type: String,
        required: true
    },
    entity: {
        type: String,
        required: true
    },
    entity_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    detail: {
        type: Object,
        default: {}
    }
},
{
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model("auditLogs", schema);