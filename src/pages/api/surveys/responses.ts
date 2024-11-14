import { NextApiRequest, NextApiResponse } from 'next';
import { UserResponse } from '@/models/UserResponse';
import { Survey } from '@/models/Survey';
import connectDB from '@/lib/db';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || '';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Connect to the database
  await connectDB();

  // Get and verify the token
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadWithUserId;
    const userId = decoded.userId;

    if (!userId) return res.status(401).json({ error: 'Invalid token' });

    // Fetch surveys created by this user
    const surveys = await Survey.find({ creatorId: userId });
    const surveyIds = surveys.map(survey => survey.surveyId);

    // Fetch all user responses for the surveys created by this user
    const userResponses = await UserResponse.find({ surveyId: { $in: surveyIds } });

    // For each response, get the survey title and the username of the person who submitted the response
    const enrichedResponses = await Promise.all(userResponses.map(async (response) => {
      const survey = surveys.find(survey => survey.surveyId === response.surveyId);
      const user = await User.findById(response.userId);  // Assuming 'userId' is present in the UserResponse

      return {
        ...response.toObject(),
        surveyTitle: survey ? survey.title : 'Unknown Survey',
        username: user ? user.username : 'Unknown User',
      };
    }));

    // Return the enriched user responses
    res.status(200).json({ responses: enrichedResponses });
  } catch (error) {
    console.error('Error fetching user responses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Define the interface for JWT payload with userId
interface JwtPayloadWithUserId extends jwt.JwtPayload {
  userId: string;
}
