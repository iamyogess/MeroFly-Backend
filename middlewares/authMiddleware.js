import JWT from "jsonwebtoken"
import UserModel from "../models/UserModel.js"

export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required!",
      })
    }

    const payload = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET)
    const user = await UserModel.findById(payload.id).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token!",
    })
  }
}

export const requireEmailVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: "Email verification required!",
      redirectTo: "/verify-email",
    })
  }
  next()
}

export const requireProfileCompletion = (req, res, next) => {
  if (!req.user.isProfileComplete) {
    return res.status(403).json({
      success: false,
      message: "Profile completion required!",
      redirectTo: "/complete-profile",
    })
  }
  next()
}

export const requireFullVerification = (req, res, next) => {
  if (!req.user.isFullyVerified) {
    return res.status(403).json({
      success: false,
      message: "Account verification required!",
      redirectTo: "/verification-status",
    })
  }
  next()
}

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required!",
    })
  }
  next()
}
