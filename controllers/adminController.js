import UserModel from "../models/UserModel.js"
import { sendNotificationEmail } from "../utils/emailServices.js"

export const reviewDocument = async (req, res, next) => {
  try {
    const { userId, action, rejectionReason } = req.body

    if (!userId || !action) {
      return res.status(400).json({
        success: false,
        message: "User ID and action are required!",
      })
    }

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be either 'approve' or 'reject'!",
      })
    }

    const user = await UserModel.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      })
    }

    if (!user.document || !user.document.url) {
      return res.status(400).json({
        success: false,
        message: "No document found for this user!",
      })
    }

    // Update document status
    user.document.status = action === "approve" ? "approved" : "rejected"
    user.document.reviewedAt = new Date()

    if (action === "approve") {
      user.isDocumentVerified = true
      await user.updateVerificationStatus()
    } else if (rejectionReason) {
      user.document.rejectionReason = rejectionReason
    }

    await user.save()

    // Send notification email
    const emailSubject = action === "approve" ? "Document Approved - Account Verified!" : "Document Rejected"
    const emailMessage =
      action === "approve"
        ? "Congratulations! Your document has been approved and your account is now fully verified. You can now access all platform features."
        : `Your document was rejected. Reason: ${rejectionReason}. Please log in to your account and upload a new document.`

    await sendNotificationEmail(user.email, user.firstName, emailSubject, emailMessage)

    return res.status(200).json({
      success: true,
      message: `Document ${action}d successfully!`,
      user: {
        _id: user._id,
        name: user.firstName + " " + user.lastName,
        email: user.email,
        isDocumentVerified: user.isDocumentVerified,
        isFullyVerified: user.isFullyVerified,
        document: user.document,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getPendingDocuments = async (req, res, next) => {
  try {
    const users = await UserModel.find({
      "document.status": "pending",
      "document.url": { $exists: true },
    }).select("firstName lastName email role phoneNumber country document createdAt")

    return res.status(200).json({
      success: true,
      message: "Pending documents retrieved successfully!",
      count: users.length,
      users,
    })
  } catch (error) {
    next(error)
  }
}
