const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const authController = require("../middlewares/authController");
const videoController = require("../controllers/videoController");

const router = express.Router();

// Set up multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/tmp");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const filename = `${uuidv4()}-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

router
  .route("/merge-video")
  .post(
    authController.protect,
    upload.array("videos", 2),
    videoController.mergeVideos
  );

module.exports = router;