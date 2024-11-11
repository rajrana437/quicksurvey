// pages/survey-responses.tsx
'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { utils, writeFile } from 'xlsx';

interface SurveyResponse {
  _id: string;
  surveyId: string;
  userId: string;
  responses: {
    questionId: string;
    answer: string | string[];
  }[];
  createdAt: string;
}

const SurveyResponsesPage = () => {
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSurveyResponses = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        const response = await axios.get('/api/surveys/responses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSurveyResponses(response.data.responses);
      } catch (error) {
        console.error('Error fetching survey responses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyResponses();
  }, []);

  // Function to download responses in Excel format
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
    const sheetName = `Survey_${surveyId}`.substring(0, 31); // Limit sheet name to 31 characters
    utils.book_append_sheet(workbook, worksheet, sheetName);
    writeFile(workbook, `${sheetName}_Responses.xlsx`);
  };
  

  if (loading) return <p>Loading survey responses...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Survey Responses</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Survey ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>User ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Responses</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Submitted On</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Download</th>
          </tr>
        </thead>
        <tbody>
          {surveyResponses.map((response) => (
            <tr key={response._id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{response.surveyId}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{response.userId}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <ul>
                  {response.responses.map((r, index) => (
                    <li key={index}>
                      <strong>Q{index + 1}:</strong> {Array.isArray(r.answer) ? r.answer.join(', ') : r.answer}
                    </li>
                  ))}
                </ul>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(response.createdAt).toLocaleString()}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button onClick={() => downloadExcel(response.surveyId)}>
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SurveyResponsesPage;
