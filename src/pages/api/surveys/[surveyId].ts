import { NextApiRequest, NextApiResponse } from 'next';
import { Survey } from '@/models/Survey';
import connectDB from '@/lib/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Connect to the database
  await connectDB();

  // Check if the method is GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Extract the surveyId from the URL params
  const { surveyId } = req.query;

  try {
    const survey = await Survey.findOne({ surveyId });
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    res.json({ survey });
  } catch (error) {
    console.error('Error fetching survey:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
