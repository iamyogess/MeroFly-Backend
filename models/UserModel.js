import mongoose from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    // Basic Info (collected during registration)
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8 },

    // Additional Info (collected after email verification)
    phoneNumber: { type: String },
    country: { type: String },
    profileImage: { type: String },
    role: {
      type: String,
      enum: ["admin", "traveler", "sender"],
    },

    // Profile completion status
    isEmailVerified: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    isDocumentVerified: { type: Boolean, default: false },
    isFullyVerified: { type: Boolean, default: false },

    // Email Verification
    verificationCode: { type: String },
    verificationCodeExpiry: { type: Date },

    // Document Verification
    document: {
      type: {
        type: String,
        enum: ["passport", "national_id", "government_id"],
      },
      url: { type: String },
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      rejectionReason: String,
      uploadedAt: Date,
      reviewedAt: Date,
    },

    // Traveler Info (collected in profile completion)
    travelerInfo: {
      destinationCountry: { type: String },
      departureTime: { type: Date },
      arrivalTime: { type: Date },
      costPerKg: { type: Number },
      pickUpLocation: { type: String },
      airline: { type: String },
      storageAvailable: { type: String },
      bookingAvailability: { type: Boolean, default: true },
    },

    // Security
    loginAttempt: { type: Number, default: 0 },
    lockUntil: { type: Date },
    isActive: { type: Boolean, default: true },
    termsAndConditions: { type: Boolean, required: true, default: false },
    privacyPolicy: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.verificationCode;
        return ret;
      },
    },
  }
);

// Get current step for user
userSchema.methods.getCurrentStep = function () {
  if (!this.isEmailVerified) return "email_verification";
  if (!this.isProfileComplete) return "profile_completion";
  if (!this.isDocumentVerified) return "document_verification";
  return "complete";
};

// Account lockout check
userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Update verification status
userSchema.methods.updateVerificationStatus = function () {
  this.isFullyVerified =
    this.isEmailVerified && this.isProfileComplete && this.isDocumentVerified;
  return this.save();
};

// Email verification methods
userSchema.methods.generateEmailVerificationCode = function () {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  this.verificationCode = code;
  this.verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return code;
};

userSchema.methods.generateVerificationCode = function () {
  return this.generateEmailVerificationCode();
};

userSchema.methods.isVerificationCodeValid = function (code) {
  return (
    this.verificationCode === code &&
    this.verificationCodeExpiry &&
    this.verificationCodeExpiry > new Date()
  );
};

// Password methods
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateJWT = function () {
  return JWT.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
      currentStep: this.getCurrentStep(),
      isFullyVerified: this.isFullyVerified,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
