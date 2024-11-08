"use client"
import { useState } from 'react';

const CreateSurveyPage = () => {
  const [numQuestions, setNumQuestions] = useState<number>(0); // Number of questions to generate
  const [questions, setQuestions] = useState<string[]>([]); // Holds questions
  const [answerTypes, setAnswerTypes] = useState<string[]>([]); // Holds answer types

  // Handle the number of questions input change
  const handleNumQuestionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setNumQuestions(value);
    setQuestions(new Array(value).fill('')); // Prepare empty question strings
    setAnswerTypes(new Array(value).fill('text')); // Set default answer type to 'text'
  };

  // Handle each question input change
  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = value;
    setQuestions(updatedQuestions);
  };

  // Handle answer type change for each question
  const handleAnswerTypeChange = (index: number, value: string) => {
    const updatedAnswerTypes = [...answerTypes];
    updatedAnswerTypes[index] = value;
    setAnswerTypes(updatedAnswerTypes);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create a Survey
            </h1>
            <div>
              <label htmlFor="numQuestions" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                How many questions do you need?
              </label>
              <input
                type="number"
                id="numQuestions"
                value={numQuestions}
                onChange={handleNumQuestionsChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Number of questions"
                required
              />
            </div>

            {/* Render question inputs dynamically based on number of questions */}
            {Array.from({ length: numQuestions }).map((_, index) => (
              <div key={index} className="space-y-4">
                <div>
                  <label htmlFor={`question${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Question {index + 1}
                  </label>
                  <input
                    type="text"
                    id={`question${index}`}
                    value={questions[index]}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter your question"
                    required
                  />
                </div>

                {/* Answer Type Dropdown */}
                <div>
                  <label htmlFor={`answerType${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Answer type for Question {index + 1}
                  </label>
                  <select
                    id={`answerType${index}`}
                    value={answerTypes[index]}
                    onChange={(e) => handleAnswerTypeChange(index, e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="text">Text</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="radio">Radio</option>
                    <option value="checkbox">Checkbox</option>
                  </select>
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Create Survey
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateSurveyPage;
