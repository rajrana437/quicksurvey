// src/pages/api/surveys/create.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Survey } from '@/models/Survey';
import connectDB from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  const { title, questions } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  // Use type assertion for decoded token
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadWithUserId;
  if (!decoded || !decoded.userId) return res.status(401).json({ error: 'Invalid token' });

  const survey = new Survey({ title, creatorId: decoded.userId, questions });
  await survey.save();
  res.status(201).json({ survey });
};

interface JwtPayloadWithUserId extends jwt.JwtPayload {
  userId: string;
}