// src/models/Survey.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IQuestion {
  question: string;
  options: string[];
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
      options: { type: [String], required: true },
    },
  ],
});

export const Survey = mongoose.models.Survey || mongoose.model<ISurvey>('Survey', SurveySchema);
