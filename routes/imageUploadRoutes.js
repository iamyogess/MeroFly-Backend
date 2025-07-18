import express from "express";
import { imageUploadMiddleware } from "../middlewares/imageMiddleware.js";
import {
  authenticateToken,
  requireEmailVerification,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/upload-verification-document",
  authenticateToken,
  requireEmailVerification,
  imageUploadMiddleware.verificationDocument.single("verificationDocument"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file uploaded!",
        });
      }

      res.json({
        success: true,
        message: "Verification Document uploaded successfully!",
        data: { url: req.file.path, urls: [req.file.path] },
      });
    } catch (error) {
      console.error("Verification document upload error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to upload verification document",
        message: error.message,
      });
    }
  }
);

router.post(
  "/upload-profile-image",
  authenticateToken,
  requireEmailVerification,
  imageUploadMiddleware.verificationDocument.single("profileImage"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file uploaded!",
        });
      }

      res.json({
        success: true,
        message: "Profile uploaded successfully!",
        data: { url: req.file.path, urls: [req.file.path] },
      });
    } catch (error) {
      console.error("Profile upload error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to upload profile image",
        message: error.message,
      });
    }
  }
);

router.use((error, req, res, next) => {
  console.error("Upload middleware error:", error);

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      error: "File too large",
      message: "File size exceeds 5MB limit",
    });
  }

  if (error.message === "Only image files are allowed!") {
    return res.status(400).json({
      success: false,
      error: "Invalid file type",
      message: "Only image files are allowed",
    });
  }

  res.status(500).json({
    success: false,
    error: "Upload failed",
    message: error.message || "Unknown error occurred",
  });
});

export default router;
