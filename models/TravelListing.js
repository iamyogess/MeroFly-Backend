import mongoose from "mongoose"

const travelListingSchema = new mongoose.Schema(
  {
    traveler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    departureCountry: { type: String, required: true },
    destinationCountry: { type: String, required: true },
    departureCity: { type: String, required: true },
    destinationCity: { type: String, required: true },
    departureDate: { type: Date, required: true },
    arrivalDate: { type: Date, required: true },
    availableWeight: { type: Number, required: true }, // in kg
    pricePerKg: { type: Number, required: true },
    pickupLocation: { type: String, required: true },
    airline: { type: String },
    flightNumber: { type: String },
    restrictions: [String],
    isActive: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["active", "full", "completed", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true },
)

// Indexes
travelListingSchema.index({ traveler: 1 })
travelListingSchema.index({ departureCountry: 1, destinationCountry: 1 })
travelListingSchema.index({ departureDate: 1 })
travelListingSchema.index({ status: 1, isActive: 1 })

const TravelListing = mongoose.model("TravelListing", travelListingSchema)
export default TravelListing
