import { sendVerificationEmail } from "../utils/emailServices.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/refreshTokenUtils.js";
import TokenModel from "../models/TokenModel.js";
import JWT from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

// Step 1: Basic Registration (only basic info)
export const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long!",
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email address!",
      });
    }

    const user = new UserModel({
      fullName,
      email,
      password,
    });

    const verificationCode = user.generateEmailVerificationCode();
    await user.save();

    const emailResult = await sendVerificationEmail(
      email,
      verificationCode,
      fullName
    );

    if (!emailResult || !emailResult.success) {
      await UserModel.findByIdAndDelete(user._id);
      return res.status(400).json({
        success: false,
        message: "Failed to send verification email. Please try again.",
      });
    }

    return res.status(201).json({
      success: true,
      message:
        "Registration successful! Please check your email for verification code.",
      userId: user._id,
      email: user.email,
      nextStep: "email_verification",
    });
  } catch (error) {
    next(error);
  }
};

// Step 2: Email Verification
export const verifyEmail = async (req, res, next) => {
  try {
    const { email, verificationCode } = req.body

    if (!email || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required!",
      })
    }

    const user = await UserModel.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      })
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified!",
      })
    }

    if (!user.isVerificationCodeValid(verificationCode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code.",
      })
    }

    user.isEmailVerified = true
    user.verificationCode = undefined
    user.verificationCodeExpiry = undefined
    await user.save()

    // ❌ REMOVED: Cookie setting - no authentication here
    // ❌ REMOVED: const token = user.generateJWT();
    // ❌ REMOVED: res.cookie("token", token, { ... });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully! Please login to continue.",
      nextStep: "login",
      redirectTo: "/auth/login", // Redirect to login instead of complete-profile
      user: {
        _id: user._id,
        name: user.fullName,
        email: user.email,
        currentStep: user.getCurrentStep(),
      },
    })
  } catch (error) {
    next(error)
  }
}
// Step 3: Complete Profile (additional details + document)
export const completeProfile = async (req, res, next) => {
  try {
    const {
      phoneNumber,
      country,
      role,
      travelerInfo,
      termsAndConditions,
      privacyPolicy,
      documentType,
      documentUrl,
    } = req.body;

    if (!phoneNumber || !country || !role || !termsAndConditions || !privacyPolicy || !documentUrl || !documentType) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    if (!["traveler", "sender"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified!",
      });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first!",
      });
    }

    // Validate document type based on role
    if (role === "traveler" && documentType !== "passport") {
      return res.status(400).json({
        success: false,
        message: "Travelers must upload passport!",
      });
    }

    if (role === "sender" && !["national_id", "government_id"].includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: "Senders must upload national ID or government ID!",
      });
    }

    // Update user profile
    user.phoneNumber = phoneNumber;
    user.country = country;
    user.role = role;
    user.termsAndConditions = termsAndConditions;
    user.privacyPolicy = privacyPolicy;
    user.isProfileComplete = true;

    // Add traveler info if role is traveler
    if (role === "traveler" && travelerInfo) {
      user.travelerInfo = {
        destinationCountry: travelerInfo.destinationCountry,
        departureTime: travelerInfo.departureTime,
        arrivalTime: travelerInfo.arrivalTime,
        costPerKg: travelerInfo.costPerKg,
        pickUpLocation: travelerInfo.pickUpLocation,
        airline: travelerInfo.airline,
        storageAvailable: travelerInfo.storageAvailable,
      };
    }

    // Add document
    user.document = {
      type: documentType,
      url: documentUrl,
      status: "pending",
      uploadedAt: new Date(),
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile completed successfully! Your document is being reviewed.",
      nextStep: "document_review",
      redirectTo: "/verification-status",
      user: {
        _id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        currentStep: user.getCurrentStep(),
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user verification status
export const getVerificationStatus = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        country: user.country,
        currentStep: user.getCurrentStep(),
        isEmailVerified: user.isEmailVerified,
        isProfileComplete: user.isProfileComplete,
        isDocumentVerified: user.isDocumentVerified,
        isFullyVerified: user.isFullyVerified,
        document: user.document,
        travelerInfo: user.travelerInfo,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    console.log("verification email", email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required!",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified!",
      });
    }

    const verificationCode = user.generateVerificationCode();
    await user.save();

    const emailResult = await sendVerificationEmail(
      email,
      user.fullName,
      verificationCode
    );

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      })
    }

    const user = await UserModel.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      })
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first!",
        needsVerification: true, // Add this field for frontend
        redirectTo: `/auth/verify-email?email=${encodeURIComponent(email)}`,
      })
    }

    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        message: "Account is temporarily locked due to too many failed login attempts.",
      })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      user.loginAttempt += 1
      if (user.loginAttempt >= 5) {
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
      }
      await user.save()
      return res.status(400).json({
        success: false,
        message: "Invalid email or password!",
      })
    }

    // Reset login attempts
    user.loginAttempt = 0
    user.lockUntil = undefined
    await user.save()

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    await TokenModel.create({ userId: user._id, token: refreshToken })

    // Set cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    // Determine where to redirect based on verification status
    let redirectTo = "/dashboard"
    const currentStep = user.getCurrentStep()

    if (currentStep === "profile_completion") {
      redirectTo = "/auth/complete-profile"
    } else if (currentStep === "document_verification") {
      redirectTo = "/verification-status"
    } else if (user.isFullyVerified) {
      // Route based on role only if fully verified
      if (user.role === "admin") {
        redirectTo = "/admin"
      } else if (user.role === "traveler") {
        redirectTo = "/merofly"
      } else if (user.role === "sender") {
        redirectTo = "/traveler"
      }
    }

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      accessToken,
      currentStep,
      redirectTo,
      needsVerification: false, // Add this field
      user: {
        _id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isProfileComplete: user.isProfileComplete,
        isDocumentVerified: user.isDocumentVerified,
        isFullyVerified: user.isFullyVerified,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const refreshAccessTokenController = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token.",
      });
    }

    const existingToken = await TokenModel.findOne({ token });
    if (!existingToken) {
      return res.status(403).json({
        success: false,
        message: "Refresh token not found!",
      });
    }

    const payload = JWT.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await UserModel.findById(payload.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const newAccessToken = JWT.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Access token refreshed.",
      token: newAccessToken,
      user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token!",
    });
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await TokenModel.findOneAndDelete({ token: refreshToken });

    res.clearCookie("refreshToken", { httpOnly: true });
    res.clearCookie("token", { httpOnly: true });

    console.log("Logged out successfully!");
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
