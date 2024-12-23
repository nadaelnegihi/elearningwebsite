// pages/create-question.js

import { useState } from 'react';
import axios from 'axios';

const CreateQuestion = () => {
  const [moduleId, setModuleId] = useState('');
  const [questionId, setQuestionId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [questionTypes, setQuestionTypes] = useState('MCQ');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setSuccess('');

    const questionData = {
      moduleId,
      questionId,
      questionText,
      options,
      correctAnswer,
      difficulty,
      questionTypes,
    };

    try {
      const response = await axios.post('/api/questions', questionData);
      setSuccess('Question created successfully!');
      console.log(response.data);
    } catch (error) {
      setError('Error creating question. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Create a New Question</h1>
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
          <label htmlFor="questionId">Question ID</label>
          <input
            type="text"
            id="questionId"
            value={questionId}
            onChange={(e) => setQuestionId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="questionText">Question Text</label>
          <textarea
            id="questionText"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="options">Options (separate with commas)</label>
          <input
            type="text"
            id="options"
            value={options.join(',')}
            onChange={(e) => setOptions(e.target.value.split(','))}
            required
          />
        </div>
        <div>
          <label htmlFor="correctAnswer">Correct Answer</label>
          <input
            type="text"
            id="correctAnswer"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="difficulty">Difficulty</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <label htmlFor="questionTypes">Question Type</label>
          <select
            id="questionTypes"
            value={questionTypes}
            onChange={(e) => setQuestionTypes(e.target.value)}
            required
          >
            <option value="MCQ">MCQ</option>
            <option value="True/False">True/False</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Question...' : 'Create Question'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default CreateQuestion;
