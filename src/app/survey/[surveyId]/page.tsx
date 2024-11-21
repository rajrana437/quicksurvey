'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Question {
  question: string;
  options?: string[];
  answerType: string;
  _id: string;
}

interface Survey {
  title: string;
  surveyId: string;
  creatorId: string;
  questions: Question[];
}

const SurveyFormPage: React.FC = () => {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [initialResponses, setInitialResponses] = useState<Record<string, string | string[]>>({}); // Store initial responses
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false); // Track submission status

  // Fetch survey data on component mount
  useEffect(() => {
    const fetchSurvey = async () => {
      const url = window.location.href;
      const surveyId = url.split('/').pop(); // Extract surveyId

      if (surveyId) {
        try {
          const response = await axios.get(`/api/surveys/${surveyId}`);
          setSurvey(response.data.survey);

          // Initialize the responses state
          const initialResponses: Record<string, string | string[]> = {};
          response.data.survey.questions.forEach((question: Question) => {
            // Set default value for each question type
            if (question.answerType === 'checkbox') {
              initialResponses[question._id] = []; // Initialize as an empty array for checkboxes
            } else {
              initialResponses[question._id] = ''; // Initialize as an empty string for other types
            }
          });

          setResponses(initialResponses);
          setInitialResponses(initialResponses); // Store initial state

        } catch (error) {
          console.error('Error fetching survey:', error);
        }
      }
    };

    fetchSurvey();
  }, []);

  const handleResponseChange = (questionId: string, value: string | string[]) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Prepare the data to send
      const userResponses = survey?.questions.map((question) => ({
        questionId: question._id,
        answer: responses[question._id], // The response for each question
      }));

      // Uncomment and configure the API call when you're ready to submit the form
      const response = await axios.post('/api/surveys/submit', {
        surveyId: survey?.surveyId,
        userId: survey?.creatorId,
        responses: userResponses,
      });

      if (response.status === 201) {
        alert('Survey submitted successfully!');
        
        // Reset the responses after submission
        setResponses(initialResponses); // Reset responses to initial state

        // Set the form as submitted
        setIsSubmitted(true);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Error submitting the survey. Please try again.');
    }
  };

  const renderInputField = (question: Question) => {
    switch (question.answerType) {
      case 'text':
        return (
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:focus:ring-primary-600"
            placeholder="Your answer"
            value={responses[question._id] || ''}
            onChange={(e) => handleResponseChange(question._id, e.target.value)}
          />
        );
      case 'radio':
        return question.options?.map((option) => (
          <label key={option} className="flex items-center space-x-3 mt-3">
            <input
              type="radio"
              name={question._id}
              value={option}
              checked={responses[question._id] === option}
              onChange={() => handleResponseChange(question._id, option)}
              className="form-radio text-primary-600 focus:ring-primary-500 dark:text-primary-400 dark:focus:ring-primary-600"
            />
            <span className="text-gray-700 dark:text-gray-300">{option}</span>
          </label>
        ));
      case 'checkbox':
        return question.options?.map((option) => (
          <label key={option} className="flex items-center space-x-3 mt-3">
            <input
              type="checkbox"
              name={question._id}
              value={option}
              checked={responses[question._id]?.includes(option)}
              onChange={() => {
                const newValue = responses[question._id] || [];
                if (Array.isArray(newValue)) {
                  if (newValue.includes(option)) {
                    handleResponseChange(question._id, newValue.filter((item: string) => item !== option));
                  } else {
                    handleResponseChange(question._id, [...newValue, option]);
                  }
                }
              }}
              
              className="form-checkbox text-primary-600 focus:ring-primary-500 dark:text-primary-400 dark:focus:ring-primary-600"
            />
            <span className="text-gray-700 dark:text-gray-300">{option}</span>
          </label>
        ));
      case 'dropdown':
        return (
          <select
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:focus:ring-primary-600"
            value={responses[question._id] || ''}
            onChange={(e) => handleResponseChange(question._id, e.target.value)}
          >
            <option value="">Select an option</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  if (!survey) return <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-6">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
        {isSubmitted ? (
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Thank you for your response!</h1>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white text-center">{survey.title}</h1>
            <form onSubmit={handleSubmit}>
              {survey.questions.map((question, index) => (
                <div key={question._id} className="mb-6">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">{index + 1}.</span>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300">{question.question}</label>
                  </div>
                  {renderInputField(question)}
                </div>
              ))}
              <div className="text-center mt-6">
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Submit
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SurveyFormPage;
