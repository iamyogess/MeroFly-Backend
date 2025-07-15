import JWT from "jsonwebtoken"

const generateAccessToken = (user) => {
  return JWT.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
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
      id: user._id,
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30d",
    },
  )
}

export { generateAccessToken, generateRefreshToken }
