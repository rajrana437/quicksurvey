'use client'

import { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { FaTrash, FaPlus, FaClipboard, FaArrowLeft } from 'react-icons/fa';  // Added FaArrowLeft for the back icon
import './styles.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

interface SurveyForm {
  title: string;
  numQuestions: string;
  questions: { question: string; answerType: string; options?: string[] }[];
}

const CreateSurveyPage = () => {
  const { control, handleSubmit, watch, setValue, reset, getValues, formState: { errors: _errors } } = useForm<SurveyForm>({
    defaultValues: {
      title: '',
      numQuestions: '',
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const [showError, setShowError] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [surveyLink, setSurveyLink] = useState<string>('');
  const [linkShowModal, setLinkShowModal] = useState<boolean>(false);


  const onSubmit = async (data: SurveyForm) => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Missing auth token. Please log in to create a survey.');
      return;
    }

    const uniqueSurveyId = uuidv4(); // Generate a unique ID using uuid
    const surveyData = { ...data, surveyId: uniqueSurveyId }; // Add surveyId to data

    console.log(surveyData);

    try {
      const response = await axios.post('/api/surveys/create', surveyData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Survey created successfully:', response.data);
      if (response.data.link) {
        setLinkShowModal(true);
        setSurveyLink(response.data.link); // Set the survey link from the response
      }
    } catch (error) {
      console.error('Error creating survey:', error);
    }
  };

  const numQuestions = watch('numQuestions');

  const handleAnswerTypeChange = (index: number, value: string) => {
    setValue(`questions.${index}.answerType`, value);
    if (value !== 'dropdown') {
      setValue(`questions.${index}.options`, []);
    }
  };

  const handleNumQuestionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : '';
    const currentTitle = getValues('title'); // Get the current title value

    if (value >= '0' || value === '') {
      setShowError(false);
      setValue("numQuestions", value.toString());
      if (typeof value === 'number') {
        setIsDisabled(true);
        const newFields = Array(value).fill({ question: '', answerType: 'text', options: [] });

        // Reset while preserving the current title
        reset({
          title: currentTitle, // Keep the current title value
          numQuestions: value.toString(),
          questions: newFields,
        });
      }
    } else {
      setShowError(true);
    }
  };

  const handleReset = () => {
    setShowModal(true);
  };

  const confirmReset = () => {
    reset({
      title: '',
      numQuestions: '',
      questions: [],
    });
    setIsDisabled(false);
    setShowModal(false);
  };

  const handleRemoveQuestion = (index: number) => {
    remove(index);
    const currentQuestions = watch('questions');
    setValue('numQuestions', currentQuestions.length.toString());
    if (currentQuestions.length === 0) {
      setIsDisabled(false);
      setValue('numQuestions', '');
    }
  };

  const handleAddQuestion = () => {
    append({ question: '', answerType: 'text', options: [] });
    const currentQuestions = watch('questions');
    setValue('numQuestions', ((currentQuestions.length + 1) - 1).toString());
  };

  const renderAnswerTypeOptions = (index: number, type: string) => {
    if (type === 'dropdown' || type === 'radio' || type === 'checkbox') {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white">Options</label>
          <Controller
            control={control}
            name={`questions.${index}.options`}
            render={({ field }) => (
              <textarea
                {...field}
                rows={3}
                placeholder="Enter options separated by commas (e.g., Option 1, Option 2)"
                className="block w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            )}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 max-w-3xl">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            {/* ... existing survey creation form code */}
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create a Survey
            </h1>

            {/* Survey Title Input */}
            <div>
              <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Survey Title
              </label>
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter survey title"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                )}
              />
            </div>

            {/* Number of Questions Input */}
            <div>
              <label htmlFor="numQuestions" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                How many questions do you need?
              </label>
              <input
                type="number"
                id="numQuestions"
                value={numQuestions}
                onChange={handleNumQuestionsChange}
                disabled={isDisabled}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Number of questions"
                required
              />
              {showError && (
                <p className="text-red-500 text-sm">Please enter a valid number of questions (greater than or equal to 0).</p>
              )}
              {isDisabled && (
                <button
                  onClick={handleReset}
                  className="mt-2 text-sm text-red-500 underline"
                >
                  Reset Questions
                </button>
              )}
            </div>

            <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar">
              {fields.map((item, index) => (
                <div key={item.id} className="space-y-2 relative">
                  <button
                    onClick={() => handleRemoveQuestion(index)}
                    className="absolute top-0 right-0 p-2 text-red-500"
                  >
                    <FaTrash />
                  </button>
                  <div>
                    <label htmlFor={`question${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Question {index + 1}
                    </label>
                    <Controller
                      control={control}
                      name={`questions.${index}.question`}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter your question"
                          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label htmlFor={`answerType${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Answer Type
                    </label>
                    <Controller
                      control={control}
                      name={`questions.${index}.answerType`}
                      render={({ field }) => (
                        <select
                          {...field}
                          onChange={(e) => handleAnswerTypeChange(index, e.target.value)}
                          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option value="text">Text</option>
                          <option value="radio">Radio Buttons</option>
                          <option value="checkbox">Checkboxes</option>
                          <option value="dropdown">Dropdown</option>
                        </select>
                      )}
                    />
                  </div>

                  {renderAnswerTypeOptions(index, watch(`questions.${index}.answerType`))}
                </div>
              ))}
            </div>
            {parseInt(numQuestions) > 0 && (  /* Conditional render based on numQuestions */

              <button
                type="button"
                onClick={handleAddQuestion}
                className="flex items-center text-blue-500 font-medium"
              >
                <FaPlus className="mr-1" /> Add Question
              </button>
            )}
            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Survey
            </button>

            <div className="flex justify-center mt-6">
              <Link href="/survey/dashboard" legacyBehavior>
                <a className="flex items-center justify-center text-blue-500 hover:text-blue-700 font-medium text-lg">
                  <FaArrowLeft className="mr-2" /> {/* Back Icon */}
                  Go Back to Dashboard
                </a>
              </Link>
            </div>
          </div>

        </div>
      </div>




      {/* Modal for reset confirmation */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">Are you sure you want to reset all questions?</p>
            <button
              onClick={confirmReset}
              className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none"
            >
              Confirm Reset
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 ml-2 text-gray-700 border rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {surveyLink && linkShowModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">Your survey link is ready!</p>
            <div className="flex items-center">
              <input
                type="text"
                value={surveyLink}
                readOnly
                className="bg-gray-200 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <div className="relative group">
                <button
                  onClick={() => navigator.clipboard.writeText(surveyLink)}
                  className="ml-2 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
                >
                  <FaClipboard />
                </button>
                <div className="hidden absolute top-full left-1/2 -translate-x-1/2 bg-gray-800 text-white p-2 rounded-md shadow-md group-hover:block">
                  Copy
                </div>
              </div>
            </div>
            <button
              onClick={() => { setLinkShowModal(false), confirmReset() }}
              className="mt-4 px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </section>
  );
};

export default CreateSurveyPage;
