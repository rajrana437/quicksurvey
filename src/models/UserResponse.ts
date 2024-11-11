import mongoose, { Schema, Document } from 'mongoose';

interface IUserResponse extends Document {
  surveyId: string;
  userId: string; // This will be the creator of the survey (no user authentication required)
  responses: Array<{
    questionId: string;
    answer: string[] | string;  // Answer can be an array (for checkboxes) or a string (for text/radio)
  }>;
}

const UserResponseSchema: Schema = new Schema({
  surveyId: { type: String, required: true },
  userId: { type: String, required: true },  // The survey creator's ID (no authentication needed)
  responses: [
    {
      questionId: { type: String, required: true },
      answer: { type: Schema.Types.Mixed, required: true },  // Store answers as a string or an array of strings
    },
  ],
}, { timestamps: true });

export const UserResponse = mongoose.models.UserResponse || mongoose.model<IUserResponse>('UserResponse', UserResponseSchema);
