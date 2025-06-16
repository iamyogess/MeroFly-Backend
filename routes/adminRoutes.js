import express from "express"
import { reviewDocument, getPendingDocuments } from "../controllers/adminController.js"
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js"

const router = express.Router()

// Admin routes (require admin role)
router.post("/review-document", authenticateToken, requireAdmin, reviewDocument)
router.get("/pending-documents", authenticateToken, requireAdmin, getPendingDocuments)

export default router
