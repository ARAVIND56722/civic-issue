// models/Issue.js
const mongoose = require("mongoose");

const statusEnum = ["submitted", "acknowledged", "in-progress", "resolved"];

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    // categorization / routing
    category: { type: String, trim: true },
    
    assignedDepartment: { type: String, trim: true }, // auto or manual

    // workflow
    status: { type: String, enum: statusEnum, default: "submitted" },
    statusHistory: [
      {
        status: { type: String, enum: statusEnum, required: true },
        note: String,
        by: String, // username/role (we'll wire admin later)
        changedAt: { type: Date, default: Date.now },
      },
    ],
    resolvedAt: Date,

    // media
    photoUrl: String,

    // ✅ reporterId for notifications
    reporterId: { type: String, required: true },

    // location (keep your old text field; add optional geo)
    location: String, // free text (e.g., "2nd Avenue, near bakery")
    coords: {
      type: { type: String, enum: ["Point"], default: undefined },
      coordinates: { type: [Number], default: undefined }, // [lng, lat]
    },
  },
  { timestamps: true }
);

// Helpful indexes
issueSchema.index({ title: "text", description: "text", category: "text" });
issueSchema.index({ coords: "2dsphere" });

module.exports = mongoose.model("Issue", issueSchema);
