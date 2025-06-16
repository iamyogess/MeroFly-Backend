import JWT from "jsonwebtoken"

const generateAccessToken = (user) => {
  return JWT.sign(
    {
      id: user._id, // Changed from _id to id for consistency with your auth middleware
      role: user.role,
      email: user.email, // Added email for additional context
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  )
}

const generateRefreshToken = (user) => {
  return JWT.sign(
    {
      id: user._id, // Changed from _id to id for consistency
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30d",
    },
  )
}

export { generateAccessToken, generateRefreshToken }
