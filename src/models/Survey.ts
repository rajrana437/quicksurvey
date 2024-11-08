// src/models/Survey.ts
import mongoose, { Schema, Document } from 'mongoose';

// Define possible answer types
type AnswerType = 'text' | 'dropdown' | 'radio' | 'checkbox';

interface IQuestion {
  question: string;
  options?: string[];  // Not all question types need options (e.g., text)
  answerType: AnswerType;  // Store the answer type for the question
}

export interface ISurvey extends Document {
  title: string;
  creatorId: string;
  questions: IQuestion[];
}

const SurveySchema: Schema = new Schema({
  title: { type: String, required: true },
  creatorId: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: { type: [String], required: false },  // Options only required for dropdown/radio/checkbox
      answerType: {
        type: String,
        enum: ['text', 'dropdown', 'radio', 'checkbox'],
        required: true,
      },
    },
  ],
});

export const Survey = mongoose.models.Survey || mongoose.model<ISurvey>('Survey', SurveySchema);
