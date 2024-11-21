'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { utils, writeFile } from 'xlsx';

interface SurveyResponse {
  _id: string;
  surveyId: string;
  userId: string;
  surveyTitle: string;
  username: string;
  responses: {
    questionId: string;
    answer: string | string[];
  }[];
  createdAt: string;
}

const SurveyResponsesPage = () => {
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();


  useEffect(() => {
    const verifyTokenAndFetchResponses = async () => {
      const token = localStorage.getItem('token');      

      if (!token) {
        // Redirect to login if token is missing
        router.push('/login');
        return;
      }

      try {
        // Attempt to fetch data with token
        const response = await axios.get('/api/surveys/responses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSurveyResponses(response.data.responses);
      } catch (error) {
        console.error('Error fetching survey responses:', error);
        // Redirect to login on fetch error, which may indicate an invalid token
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    verifyTokenAndFetchResponses();
  }, [router]);


  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    router.push('/login'); // Redirect to login page
  };

  const downloadExcel = (surveyId: string) => {
    const responses = surveyResponses.filter(response => response.surveyId === surveyId);
    const worksheetData = responses.map(response => ({
      UserID: response.userId,
      SurveyID: response.surveyId,
      CreatedAt: new Date(response.createdAt).toLocaleString(),
      ...Object.fromEntries(
        response.responses.map((r) => [r.questionId, Array.isArray(r.answer) ? r.answer.join(', ') : r.answer])
      ),
    }));

    const worksheet = utils.json_to_sheet(worksheetData);
    const workbook = utils.book_new();
    const sheetName = `Survey_${surveyId}`.substring(0, 31);
    utils.book_append_sheet(workbook, worksheet, sheetName);
    writeFile(workbook, `${sheetName}_Responses.xlsx`);
  };

  if (loading) return <p className="text-center text-gray-500 dark:text-gray-400">Loading dashboard...</p>;

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">

      {surveyResponses.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-lg mb-4">No dashboard available.</p>

          <div className="flex gap-4">
            <button
              onClick={() => router.push('/survey/create')}
              className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
            >
              Create Survey
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <div>
              <button
                onClick={() => router.push('/survey/create')}
                className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition mr-4"
              >
                Create Survey
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 text-left">
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Survey Title</th>
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Username</th>
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Responses</th>
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Submitted On</th>
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Download</th>
                </tr>
              </thead>
              <tbody>
                {surveyResponses.map((response) => (
                  <tr key={response._id} className="even:bg-gray-50 dark:even:bg-gray-800">
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{response.surveyTitle}</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{response.username}</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                      <ul className="list-disc pl-4">
                        {response.responses.map((r, index) => (
                          <li key={index}>
                            <strong>Q{index + 1}:</strong> {Array.isArray(r.answer) ? r.answer.join(', ') : r.answer}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{new Date(response.createdAt).toLocaleString()}</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                      <button
                        onClick={() => downloadExcel(response.surveyId)}
                        className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default SurveyResponsesPage;
