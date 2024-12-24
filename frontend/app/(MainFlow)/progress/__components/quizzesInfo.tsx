// components/QuizzesCard.tsx
import React from "react";

type TopScore = {
  userId: string;
  score: number;
};

type Quiz = {
  quizId: string;
  totalSubmissions: number;
  averageScore: number;
  topScores: TopScore[];
};

type PerformanceData = {
  courseId: string;
  courseName: string;
  quizzes: Quiz[];
};

type QuizzesCardProps = {
  data: PerformanceData;
};

const QuizzesCard: React.FC<QuizzesCardProps> = ({ data }) => {
  const { courseName, quizzes } = data;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-96 text-gray-800">
      <h2 className="text-2xl font-bold">{courseName}</h2>

      <div className="mt-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz.quizId}
            className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-700">Quiz ID: {quiz.quizId}</h3>
            <p className="mt-2">
              <span className="font-semibold">Total Submissions:</span> {quiz.totalSubmissions}
            </p>
            <p>
              <span className="font-semibold">Average Score:</span>{" "}
              {quiz.averageScore.toFixed(2)}
            </p>

            <div className="mt-4">
              <h4 className="text-md font-semibold text-gray-700">Top Scores</h4>
              <ul className="mt-2 space-y-2">
                {quiz.topScores.map((score, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-blue-100 text-blue-800 p-2 rounded-md shadow"
                  >
                    <span>User ID: {score.userId}</span>
                    <span className="font-semibold">Score: {score.score}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizzesCard;
