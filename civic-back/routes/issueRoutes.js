// routes/issueRoutes.js

const { createNotification } = require("../controllers/notificationController");
const express = require("express");
const router = express.Router();
const Issue = require("../models/Issue");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });

const { autoAssign } = require("../utils/department");

router.get("/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    res.json(issue);
  } catch (err) {
    console.error("Error fetching issue:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- CREATE issue ---
router.post("/", auth, upload.single("photo"), async (req, res) => {
  console.log("🟢 Full req.body:", req.body);
  console.log("🟢 File:", req.file);

  try {
    const { title, description, category, location, lat, lng, status } = req.body;
    const assignedDepartment = autoAssign(category);

    const doc = new Issue({
      title,
      description,
      category,
      location,
      assignedDepartment,
      status: status || "submitted",
      photoUrl: req.file ? req.file.path : undefined,
      reporterId: req.user.userId,
      ...(lat && lng
        ? { coords: { type: "Point", coordinates: [Number(lng), Number(lat)] } }
        : {}),
      statusHistory: [{ status: status || "submitted", by: req.user.userId }],
    });

    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// --- LIST with filters/pagination/sort (role based) ---
router.get("/", auth, async (req, res) => {
  try {
    const {
      status,
      category,
      department,
      q, // text search in title/description
      from, // ISO date
      to, // ISO date
      lat,
      lng,
      radiusKm, // geofilter radius
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    // ✅ base filter depends on role
    const filter = {};
    if (req.user.role !== "admin") {
      filter.reporterId = req.user.userId; // Citizen → only their issues
    }
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (department) filter.assignedDepartment = department;

    // ✅ date range
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    // ✅ start query
    let query = Issue.find(filter);

    // text search
    if (q) {
      query = query.find({ $text: { $search: q } });
    }

    // geo search
    if (lat && lng && radiusKm) {
      query = query.find({
        coords: {
          $near: {
            $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
            $maxDistance: Number(radiusKm) * 1000,
          },
        },
      });
    }

    // pagination + sorting
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      query.sort(sort).skip(skip).limit(Number(limit)),
      Issue.countDocuments(filter),
    ]);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit) || 1),
      items,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- STATUS UPDATE with validation, history, and notifications ---
const allowedTransitions = {
  submitted: ["acknowledged"],
  acknowledged: ["in-progress", "resolved"],
  "in-progress": ["resolved"],
  resolved: [], // terminal
};

router.put("/:id/status", auth, requireRole("admin"), async (req, res) => {
  try {
    const { status, note } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: "Issue not found" });

    const from = issue.status;
    const allowed = allowedTransitions[from] || [];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        error: `Invalid transition: ${from} → ${status}. Allowed: ${
          allowed.join(", ") || "(none)"
        }`,
      });
    }

    // Update issue status and history
    issue.status = status;
    issue.statusHistory.push({ status, note, by: req.user.userId });
    if (status === "resolved") issue.resolvedAt = new Date();

    await issue.save();

    // --- Persistent + Real-time notification ---
    const io = req.app.get("io");
    if (issue.reporterId) {
      await createNotification(
        {
          userId: issue.reporterId,
          title: "Issue status updated",
          message: `Your issue "${issue.title}" is now ${status}`,
          type: "status_update",
          data: { issueId: issue._id, note },
        },
        io
      );
    }

    res.json(issue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- MANUAL ASSIGNMENT (optional override) ---
router.put("/:id/assign", async (req, res) => {
  try {
    const { department } = req.body;
    if (!department) return res.status(400).json({ error: "department is required" });

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { assignedDepartment: department },
      { new: true }
    );
    if (!issue) return res.status(404).json({ error: "Issue not found" });

    // --- Real-time notification ---
    const io = req.app.get("io");
    io.emit("issueAssigned", {
      issueId: issue._id,
      department: issue.assignedDepartment,
      updatedAt: new Date(),
    });

    res.json(issue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- SIMPLE UPDATE/DELETE (still useful) ---
router.put("/:id", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!issue) return res.status(404).json({ error: "Issue not found" });
    res.json(issue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) return res.status(404).json({ error: "Issue not found" });
    res.json({ message: "Issue deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
