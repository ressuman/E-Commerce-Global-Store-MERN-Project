import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const createToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    //secure: false, // Ensure false for development
    sameSite: "strict",
    //sameSite: "lax", // Use "lax" instead of "strict" for cross-site requests during login
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

export default createToken;
