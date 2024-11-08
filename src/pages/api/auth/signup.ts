import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../models/User";

const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI!, {});
};

const signupHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { username, email, password } = req.body;

  // Validate the input
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Connect to the database
    await connectToDatabase();

    // Check if the user already exists (by username or email)
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        message: existingUser.username === username
          ? "Username already exists"
          : "Email already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(username, email, hashedPassword);
    

    // Create a new user
    const newUser = new User({
      username,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();

    console.log(newUser);
    

    // Create a JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    // Respond with the token and user details (excluding password)
    res.status(201).json({
      token,
      user: { username: newUser.username, email: newUser.email },
    });
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handling the duplicate key error specifically
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      const errorMessage = duplicateField === "email" ? "Email already exists" : "Username already exists";
      return res.status(400).json({ message: errorMessage });
    }

    // General error response
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default signupHandler;
