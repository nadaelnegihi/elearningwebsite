
import React from "react";

type ModuleRating = {
    name: string;
    moduleId: string;
    averageRating: number;
};

type Course = {
    courseId: {
        modules: any[];
        ratings: any[];
        isAvailable: boolean;
        _id: string;
        title: string;
        description: string;
        category: string;
        difficulty_level: string;
        keywords: string[];
        createdAt: string;
    };
    courseName: string;
    courseRating: number;
    moduleRatings: ModuleRating[];
    instructorRating: number;
};

type ContentEffectivnessCardProps = {
    course: Course;
};

const ContentEffectivnessCard: React.FC<ContentEffectivnessCardProps> = ({ course }) => {
    const {
        courseId: { title, description, category, difficulty_level, keywords, isAvailable, createdAt },
        courseRating,
        moduleRatings,
        instructorRating,
    } = course;

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-96">
            <p className="text-gray-600">Course Name: {title}</p>

            <div className="mt-4 text-gray-800">
                <h3 className="text-lg font-semibold">Ratings</h3>
                <p className="mt-2">
                    <span className="font-semibold">Course Rating:</span> {courseRating} / 5
                </p>
                <p>
                    <span className="font-semibold">Instructor Rating:</span> {instructorRating} / 5
                </p>
            </div>

            <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-800">Module Ratings</h4>
                <ul className="list-disc list-inside mt-2">
                    {moduleRatings.map((module) => (
                        <li key={module.moduleId} className="text-gray-700">
                            <span className="font-semibold">Module Name:</span> {module.name} -{" "}
                            <span className="font-semibold">Average Rating:</span> {module.averageRating} / 5
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ContentEffectivnessCard;
