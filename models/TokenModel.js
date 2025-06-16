import mongoose from "mongoose"

const TokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 2592000,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better performance
TokenSchema.index({ userId: 1 })
TokenSchema.index({ token: 1 })

const TokenModel = mongoose.model("Token", TokenSchema)
export default TokenModel
