"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import axiosInstance from "@/app/lib/axiosInstance";

export default function CreateQuestionPage() {
  const router = useRouter();
  const { moduleId, courseId } = useParams();
  const [formData, setFormData] = useState({
    questionId: "",
    questionText: "",
    options: ["", "", "", ""], // Default 4 options for MCQ
    correctAnswer: "",
    difficulty: "easy",
    questionTypes: "MCQ",
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
    if (name === "options" && index !== undefined) {
      const updatedOptions = [...formData.options];
      updatedOptions[index] = value;
      setFormData({ ...formData, options: updatedOptions });
    } else {
      setFormData({ ...formData, [name]: value });

      // Reset options and correctAnswer if questionTypes changes
      if (name === "questionTypes") {
        if (value === "True/False") {
          setFormData({
            ...formData,
            questionTypes: value,
            options: [], // No options needed for True/False
            correctAnswer: "True", // Default correct answer for True/False
          });
        } else {
          setFormData({
            ...formData,
            questionTypes: value,
            options: ["", "", "", ""], // Default options for MCQ
            correctAnswer: "",
          });
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    try {
      await axiosInstance.post("/quizzes/questions", {
        ...formData,
        moduleId,
      });
      alert("Question created successfully!");
      router.push(`/courses/${courseId}`);
    } catch (error: any) {
      setFormError(error.response?.data?.message || "Failed to create question");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center py-10 px-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Create Question</h2>
        {formError && <p className="text-red-500 mb-4">{formError}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="questionId" className="block text-sm font-medium mb-1">
              Question ID
            </label>
            <input
              id="questionId"
              type="text"
              name="questionId"
              value={formData.questionId}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="questionText" className="block text-sm font-medium mb-1">
              Question Text
            </label>
            <textarea
              id="questionText"
              name="questionText"
              value={formData.questionText}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
              required
            ></textarea>
          </div>
          {formData.questionTypes === "MCQ" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Options</label>
              {formData.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  name="options"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full p-2 bg-gray-700 text-white rounded-md mb-2"
                  required
                />
              ))}
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="correctAnswer" className="block text-sm font-medium mb-1">
              Correct Answer
            </label>
            {formData.questionTypes === "MCQ" ? (
              <input
                id="correctAnswer"
                type="text"
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 text-white rounded-md"
                required
              />
            ) : (
              <select
                id="correctAnswer"
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 text-white rounded-md"
                required
              >
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="difficulty" className="block text-sm font-medium mb-1">
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="questionTypes" className="block text-sm font-medium mb-1">
              Question Type
            </label>
            <select
              id="questionTypes"
              name="questionTypes"
              value={formData.questionTypes}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
              required
            >
              <option value="MCQ">Multiple Choice Question (MCQ)</option>
              <option value="True/False">True/False</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-500 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className={`px-6 py-2 rounded-md ${
                formLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              {formLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
