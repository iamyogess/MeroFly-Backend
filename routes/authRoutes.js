import express from "express"
import {
  registerUser,
  verifyEmail,
  resendVerificationEmail,
  loginUser,
  refreshAccessTokenController,
  logoutUser,
  completeProfile,
  getVerificationStatus,
} from "../controllers/authController.js"
import { authenticateToken, requireEmailVerification } from "../middlewares/authMiddleware.js"
import multer from "multer"

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/documents/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
      cb(null, true)
    } else {
      cb(new Error("Only images and PDF files are allowed!"), false)
    }
  },
})

// Step-by-step registration flow
router.post("/register", registerUser) // Step 1: Basic registration
router.post("/verify-email", verifyEmail) // Step 2: Email verification
router.post(
  "/complete-profile",
  authenticateToken,
  requireEmailVerification,
  upload.single("document"),
  completeProfile,
) // Step 3: Profile + document

// Other auth routes
router.post("/resend-verification", resendVerificationEmail)
router.post("/login", loginUser)
router.post("/refresh-token", refreshAccessTokenController)
router.post("/logout", logoutUser)

// Status check
router.get("/verification-status", authenticateToken, getVerificationStatus)

export default router
