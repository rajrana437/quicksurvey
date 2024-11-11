import { NextApiRequest, NextApiResponse } from 'next';
import { Survey } from '@/models/Survey';
import connectDB from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  const { title, questions, surveyId } = req.body; 
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  // Use type assertion for decoded token
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadWithUserId;
  if (!decoded || !decoded.userId) return res.status(401).json({ error: 'Invalid token' });

  // Validate the question structure and answer types
  const isValid = questions.every((question: any) => {
    return (
      question.question &&
      ['text', 'dropdown', 'radio', 'checkbox'].includes(question.answerType) &&
      (question.answerType !== 'text' ? Array.isArray(question.options) && question.options.length > 0 : true)
    );
  });

  if (!isValid) {
    return res.status(400).json({ error: 'Invalid question structure or missing options for answer types' });
  }

  const survey = new Survey({ title, creatorId: decoded.userId, questions, surveyId });
  await survey.save();

  // Generate the survey link using the saved survey ID
  const surveyLink = `${process.env.HOST_URL}/surveys/${survey.surveyId}`;

  res.status(201).json({ survey, link: surveyLink });
};

interface JwtPayloadWithUserId extends jwt.JwtPayload {
  userId: string;
}