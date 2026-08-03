const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Matches your actual middleware: default export, not { verifyAdminToken }.
// Update this path only if your file lives somewhere other than Middlewares/.
const authenticateAdmin = require("../Middlewares/admin.middleware");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "landing");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    // req.body.field arrives as "heroImageUrl" or "logoUrl" from the frontend upload call
    const safeField = (req.body.field || "image").replace(/[^a-z0-9-]/gi, "");
    cb(null, `${safeField}-${Date.now()}${ext}`);
  },
});

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, WEBP, or SVG images are allowed."));
    }
    cb(null, true);
  },
});

router.post("/upload-image", authenticateAdmin, (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || "Upload failed." });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file received." });
    }
    const publicUrl = `/uploads/landing/${req.file.filename}`;
    res.json({ success: true, data: { url: publicUrl } });
  });
});

module.exports = router;