const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        photoURL: { type: String, default: "" },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "active"
        },
        role: { type: String, enum: ["user", "admin"], default: "user" },
    },
    { timestamps: true }
);


module.exports = mongoose.model('User', UserSchema);