"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/lib/axiosInstance";

interface Question {
  _id: string;
  questionId: string;
  questionText: string;
  options: string[];
}

interface Quiz {
  _id: string;
  title: string;
  questions: Question[];
}

interface ResultDetails {
  percentage: number;
  feedback: string[];
  detailedResults: {
    questionId: string;
    status: string;
    selectedAnswer: string;
    correctAnswer: string;
  }[];
}

export default function TakeQuizPage() {
  const { courseId, moduleId, quizId } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [results, setResults] = useState<ResultDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axiosInstance.get(`/quizzes/fetch/${quizId}`);
        setQuiz(response.data);
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
        router.push(`/courses/${courseId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, router, courseId]);

  const handleAnswerChange = (questionId: string, selectedAnswer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedAnswer }));
  };

  const handleSubmitQuiz = async () => {
    try {
      // Fetch the student ID from the API or authentication context
      const profileResponse = await axiosInstance.get("/users/profile");
      const studentId = profileResponse.data._id; // Replace with the actual key for the user ID in the profile data
  
      const response = await axiosInstance.post(`/responses/${quizId}/submit`, {
        studentId, // Pass the actual student ID
        answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer,
        })),
      });
      setResults(response.data);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      alert("An error occurred while submitting the quiz.");
    }
  };
  
  if (loading) return <div>Loading...</div>;

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <div>Quiz not found or no questions available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          {quiz.title}
        </h1>

        {submitted && results ? (
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Results
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Score: {results.percentage}%
            </p>
            <ul className="list-disc pl-5">
              {results.feedback.map((feedback, index) => (
                <li key={index} className="text-gray-600 dark:text-gray-400">
                  {feedback}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <form onSubmit={(e) => e.preventDefault()}>
            {quiz.questions.map((question) => (
              <div key={question._id} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {question.questionText}
                </h3>
                <div className="mt-2">
                  {question.options && question.options.length > 0 ? (
                    question.options.map((option, index) => (
                      <div key={`${question._id}-${index}`} className="mb-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={question._id}
                            value={option}
                            checked={answers[question._id] === option}
                            onChange={() => handleAnswerChange(question._id, option)}
                            className="form-radio text-blue-600"
                          />
                          <span className="ml-2 text-gray-600 dark:text-gray-400">{option}</span>
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">No options available.</p>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={handleSubmitQuiz}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
            >
              Submit Quiz
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
