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

  const { id } = req.query;

  try {
    // Find the survey by the provided ID
    const survey = await Survey.findById(id);
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    // Respond with the survey data
    return res.status(200).json(survey);
  } catch (error) {
    console.error('Error fetching survey:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
