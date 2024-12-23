// pages/create-quiz.js

import { useState } from 'react';
import axios from 'axios';

const CreateQuiz = () => {
  const [moduleId, setModuleId] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);
  const [questionTypes, setQuestionTypes] = useState('MCQ');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Assuming your backend API is running locally or set up accordingly
      const response = await axios.post('/api/create-quiz', {
        moduleId,
        numberOfQuestions,
        questionTypes,
        studentId,
      });

      // If the quiz is created successfully
      setSuccess('Quiz created successfully!');
      console.log(response.data); // You can handle the response accordingly
    } catch (err) {
      setError('Error creating quiz. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Create a New Quiz</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="moduleId">Module ID</label>
          <input
            type="text"
            id="moduleId"
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="numberOfQuestions">Number of Questions</label>
          <input
            type="number"
            id="numberOfQuestions"
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
            min="1"
            required
          />
        </div>
        <div>
          <label htmlFor="questionTypes">Question Types</label>
          <select
            id="questionTypes"
            value={questionTypes}
            onChange={(e) => setQuestionTypes(e.target.value)}
            required
          >
            <option value="MCQ">MCQ</option>
            <option value="True/False">True/False</option>
            <option value="Both">Both</option>
          </select>
        </div>
        <div>
          <label htmlFor="studentId">Student ID</label>
          <input
            type="text"
            id="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Quiz...' : 'Create Quiz'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default CreateQuiz;
