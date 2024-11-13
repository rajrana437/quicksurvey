// src/pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';

const JWT_SECRET: string = "your_secret_key";

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

// Define the handler function
const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  const { username, password } = req.body;

  console.log(username, password);

  const user = await User.findOne({ username });

  console.log(user);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
};

// Export the handler function as default
export default loginHandler;
