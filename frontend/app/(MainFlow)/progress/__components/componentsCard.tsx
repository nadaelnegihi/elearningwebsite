// components/PerformanceCard.tsx
import React from "react";

type PerformanceMetrics = {
  belowAverage: number;
  average: number;
  aboveAverage: number;
  excellent: number;
};

type PerformanceData = {
  courseId: {
    title: string;
  };
  courseName: string;
  enrolledStudents: number;
  completedStudents: number;
  performanceMetrics: PerformanceMetrics;
};

type PerformanceCardProps = {
  data: PerformanceData;
};

const PerformanceCard: React.FC<PerformanceCardProps> = ({ data }) => {
  const { courseId, courseName, enrolledStudents, completedStudents, performanceMetrics } = data;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-96 text-gray-800">
      <h2 className="text-2xl font-bold">{courseId.title}</h2>
      <div className="mt-4">
        <p>
          <span className="font-semibold">Enrolled Students:</span> {enrolledStudents}
        </p>
        <p>
          <span className="font-semibold">Completed Students:</span> {completedStudents}
        </p>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800">Performance Metrics</h3>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="bg-red-100 text-red-800 p-2 rounded shadow-sm">
            <p className="font-semibold">Below Average</p>
            <p className="text-xl">{performanceMetrics.belowAverage}</p>
          </div>
          <div className="bg-yellow-100 text-yellow-800 p-2 rounded shadow-sm">
            <p className="font-semibold">Average</p>
            <p className="text-xl">{performanceMetrics.average}</p>
          </div>
          <div className="bg-blue-100 text-blue-800 p-2 rounded shadow-sm">
            <p className="font-semibold">Above Average</p>
            <p className="text-xl">{performanceMetrics.aboveAverage}</p>
          </div>
          <div className="bg-green-100 text-green-800 p-2 rounded shadow-sm">
            <p className="font-semibold">Excellent</p>
            <p className="text-xl">{performanceMetrics.excellent}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCard;
