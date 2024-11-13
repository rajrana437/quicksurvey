import { NextApiRequest, NextApiResponse } from 'next';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

// Define the handler function
const signupHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected");

    const { username, email, password } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password) {
      console.log("Missing required fields");
      return res.status(400).json({ error: 'All fields are required' });
    }

    console.log("Checking for existing user...");
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log("User with this email or username already exists");
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    console.log("Creating new user...");
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    console.log("User created");

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
    console.log("Token generated");

    res.status(201).json({ token });
  } catch (error) {
    console.error("Error in signup handler:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Export the handler function as default
export default signupHandler;
