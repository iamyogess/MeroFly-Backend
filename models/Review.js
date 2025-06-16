import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
    categories: {
      communication: { type: Number, min: 1, max: 5 },
      reliability: { type: Number, min: 1, max: 5 },
      packaging: { type: Number, min: 1, max: 5 }, // for senders
      carefulness: { type: Number, min: 1, max: 5 }, // for travelers
    },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true },
)

// Ensure one review per booking per user
reviewSchema.index({ booking: 1, reviewer: 1 }, { unique: true })
reviewSchema.index({ reviewee: 1 })

const Review = mongoose.model("Review", reviewSchema)
export default Review
