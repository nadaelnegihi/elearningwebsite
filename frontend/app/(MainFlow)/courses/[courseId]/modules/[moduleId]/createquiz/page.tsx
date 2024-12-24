"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axiosInstance from "@/app/lib/axiosInstance";

export default function CreateQuizPage() {
  const router = useRouter();
  const { moduleId,courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [formData, setFormData] = useState({
    numberOfQuestions: 5,
    questionTypes: "MCQ",
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get("/users/students");
        setStudents(response.data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!selectedStudent) {
      alert("Please select a student.");
      return;
    }

    try {
      await axiosInstance.post("/quizzes/create", {
        ...formData,
        studentId: selectedStudent,
        moduleId,
      });
      alert("Quiz created successfully!");
      router.push(`/courses/${courseId}`);
    } catch (error) {
      console.error("Failed to create quiz:", error);
      alert("Failed to create quiz. Please try again.");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center py-10 px-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>
        <div className="space-y-4">
          <div className="mb-4">
            <label htmlFor="studentSelect" className="block text-sm font-medium mb-1">
              Select Student
            </label>
            <select
              id="studentSelect"
              onChange={(e) => setSelectedStudent(e.target.value)}
              value={selectedStudent}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
            >
              <option value="">Select a Student</option>
              {students.map((student: any) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.email})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="numberOfQuestions" className="block text-sm font-medium mb-1">
              Number of Questions
            </label>
            <input
              id="numberOfQuestions"
              type="number"
              name="numberOfQuestions"
              placeholder="Enter number of questions"
              value={formData.numberOfQuestions}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
              required
            />
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
              <option value="MCQ">Multiple Choice Questions (MCQ)</option>
              <option value="True/False">True/False</option>
              <option value="Both">Both</option>
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
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
            >
              Create Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
