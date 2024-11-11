import { NextApiRequest, NextApiResponse } from 'next';
import { UserResponse } from '@/models/UserResponse';
import { Survey } from '@/models/Survey';
import connectDB from '@/lib/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Connect to the database
  await connectDB();

  // Extract the payload from the request body
  const { surveyId, userId, responses } = req.body;

  // Validate the inputs
  if (!surveyId || !userId || !Array.isArray(responses)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  // Fetch the survey to verify it exists
  const survey = await Survey.findOne({ surveyId });
  if (!survey) {
    return res.status(404).json({ error: 'Survey not found' });
  }

  // Check that all responses contain a valid questionId and answer
  const validResponses = responses.every((response: any) => {
    return (
      response.questionId &&
      response.answer &&
      survey.questions.some((q: any) => q._id.toString() === response.questionId)
    );
  });

  if (!validResponses) {
    return res.status(400).json({ error: 'Invalid response data' });
  }

  try {
    // Save the user responses
    const userResponse = new UserResponse({
      surveyId,
      userId,  // This is the creator's ID
      responses,
    });

    await userResponse.save();

    // Respond with a success message
    res.status(201).json({ message: 'Survey responses submitted successfully' });
  } catch (error) {
    console.error('Error saving survey responses:', error);
    res.status(500).json({ error: 'Error saving survey responses' });
  }
};
