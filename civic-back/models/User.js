const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, enum: ["citizen", "admin"], default: "citizen" },
  department: { type: String }, // optional for admin users (e.g., "Electricity")
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
