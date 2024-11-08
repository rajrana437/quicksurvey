"use client"
import { useState } from 'react';
import { useForm, Controller, useFieldArray, FieldValues } from 'react-hook-form';

interface SurveyForm {
  numQuestions: number;
  questions: { question: string; answerType: string; options?: string[] }[];
}

const CreateSurveyPage = () => {
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<SurveyForm>({
    defaultValues: {
      numQuestions: 0,
      questions: [],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions', // Dynamically handling questions as an array
  });

  const [showError, setShowError] = useState<boolean>(false);
  
  // Handling form submission
  const onSubmit = (data: SurveyForm) => {
    console.log(data); // You can handle your form submission here (e.g., send data to server)
  };

  // Watch numQuestions to dynamically render questions
  const numQuestions = watch('numQuestions');

  // Add or remove options for dropdown/radio/checkbox question types
  const handleAnswerTypeChange = (index: number, value: string) => {
    setValue(`questions.${index}.answerType`, value);
    if (value !== 'dropdown') {
      setValue(`questions.${index}.options`, []); // Reset options if not dropdown
    }
  };

  const handleNumQuestionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 0) {
      setShowError(false); // Reset error if the input is valid
      setValue("numQuestions", value);
      const newFields = Array(value).fill({ question: '', answerType: 'text', options: [] });
      append(newFields); // Dynamically add the fields
    } else {
      setShowError(true); // Show error for invalid input
    }
  };

  // Render input fields for options when answer type is dropdown, radio or checkbox
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
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create a Survey
            </h1>

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
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Number of questions"
                required
              />
              {showError && (
                <p className="text-red-500 text-sm">Please enter a valid number of questions (greater than or equal to 0).</p>
              )}
            </div>

            {/* Dynamic Question Inputs */}
            {fields.map((item, index) => (
              <div key={item.id} className="space-y-4">
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

                {/* Answer Type Dropdown */}
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
                        <option value="dropdown">Dropdown</option>
                        <option value="radio">Radio</option>
                        <option value="checkbox">Checkbox</option>
                      </select>
                    )}
                  />
                </div>

                {/* Render answer type options if necessary */}
                {renderAnswerTypeOptions(index, watch(`questions.${index}.answerType`))}
              </div>
            ))}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
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
