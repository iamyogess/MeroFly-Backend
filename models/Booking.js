import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    traveler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    travelListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelListing",
      required: true,
    },

    // Package Info
    package: {
      description: { type: String, required: true },
      weight: { type: Number, required: true },
      category: {
        type: String,
        enum: ["documents", "electronics", "clothing", "gifts", "other"],
        required: true,
      },
      value: { type: Number }, // declared value
      images: [String], // URLs to package images
    },

    // Sender Info (entered during booking as requested)
    senderInfo: {
      pickupAddress: { type: String, required: true },
      pickupCity: { type: String, required: true },
      pickupCountry: { type: String, required: true },
      contactPerson: { type: String, required: true },
      contactPhone: { type: String, required: true },
      preferredPickupTime: { type: Date },
    },

    // Delivery Info (entered during booking)
    deliveryInfo: {
      deliveryAddress: { type: String, required: true },
      deliveryCity: { type: String, required: true },
      deliveryCountry: { type: String, required: true },
      recipientName: { type: String, required: true },
      recipientPhone: { type: String, required: true },
    },

    // Pricing
    totalPrice: { type: Number, required: true },
    platformFee: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "accepted", "picked_up", "in_transit", "delivered", "cancelled"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "released", "refunded"],
      default: "pending",
    },

    // Simple tracking
    trackingUpdates: [
      {
        status: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
)

// Indexes
bookingSchema.index({ sender: 1 })
bookingSchema.index({ traveler: 1 })
bookingSchema.index({ status: 1 })
bookingSchema.index({ createdAt: -1 })

const Booking = mongoose.model("Booking", bookingSchema)
export default Booking
