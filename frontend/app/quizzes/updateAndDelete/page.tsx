import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

interface Question {
  questionId: string;
  moduleId: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  questionTypes: "MCQ" | "True/False";
  deleted: boolean;
}

const QuestionPage = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updateData, setUpdateData] = useState<Partial<Question>>({});
  const router = useRouter();
  const { questionId } = router.query;

  useEffect(() => {
    if (!questionId) return;

    // Fetch question data on page load
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`/api/questions/${questionId}`);
        setQuestion(response.data);
      } catch (err) {
        setError("Error fetching question");
      }
    };
    
    fetchQuestion();
  }, [questionId]);

  const handleUpdate = async () => {
    if (!questionId) return;

    try {
      await axios.put(`/api/questions/${questionId}`, updateData);
      alert("Question updated successfully");
    } catch (err) {
      setError("Error updating question");
    }
  };

  const handleDelete = async () => {
    if (!questionId) return;

    try {
      await axios.delete(`/api/questions/${questionId}`);
      alert("Question deleted successfully");
      router.push("/questions"); // Redirect after deletion
    } catch (err) {
      setError("Error deleting question");
    }
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Manage Question</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <h2>Update Question</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <label>Question Text:</label>
            <input
              type="text"
              value={updateData.questionText || question.questionText}
              onChange={(e) => setUpdateData({ ...updateData, questionText: e.target.value })}
            />
          </div>
          <div>
            <label>Options (comma separated):</label>
            <input
              type="text"
              value={updateData.options?.join(", ") || question.options.join(", ")}
              onChange={(e) => setUpdateData({ ...updateData, options: e.target.value.split(", ") })}
            />
          </div>
          <div>
            <label>Correct Answer:</label>
            <input
              type="text"
              value={updateData.correctAnswer || question.correctAnswer}
              onChange={(e) => setUpdateData({ ...updateData, correctAnswer: e.target.value })}
            />
          </div>
          <div>
            <label>Difficulty:</label>
            <select
              value={updateData.difficulty || question.difficulty}
              onChange={(e) => setUpdateData({ ...updateData, difficulty: e.target.value as "easy" | "medium" | "hard" })}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label>Question Type:</label>
            <select
              value={updateData.questionTypes || question.questionTypes}
              onChange={(e) => setUpdateData({ ...updateData, questionTypes: e.target.value  as "MCQ" | "True/False" })}
            >
              <option value="MCQ">MCQ</option>
              <option value="True/False">True/False</option>
            </select>
          </div>
          <button type="button" onClick={handleUpdate}>
            Update Question
          </button>
        </form>
      </div>

      <div>
        <h2>Delete Question</h2>
        <button onClick={handleDelete} style={{ color: "red" }}>
          Delete Question
        </button>
      </div>
    </div>
  );
};

export default QuestionPage;
