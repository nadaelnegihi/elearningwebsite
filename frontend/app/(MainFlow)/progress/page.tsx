"use client";

import { downloadAnalytics, getContentEffectivenessAnalytics, getCourseCompletionRate, getQuizzesByInstructor, getStudentAverageScore, getStudentEngagementAnalytics, getStudentPerformanceMetric, getUserCourses } from "@/app/lib/api";
import { useEffect, useState } from "react";
import { useUserContext } from "@/app/__context";
import ContentEffectivnessCard from "./__components/contentEffectiveness";
import PerformanceCard from "./__components/componentsCard";
import DownloadCSVButton from "./__components/csvButton";
import QuizzesCard from "./__components/quizzesInfo";





export default function StudentProgress() {
    const [quizzesInfo, setquizzesInfo] = useState([])
    const [csvButton, setcsvButton] = useState("")
    const [conetntEffectivness, setconetntEffectivness] = useState([])
    const [componentsCard, setcomponentsCard] = useState([])
    const { role } = useUserContext()
    const [coursesProgress, setCoursesProgress] = useState<{ [key: string]: number }>({})
    const [coursesMatrix, setCoursesMatrix] = useState<{ [key: string]: number }>({})
    const [avgScore, setAvgScore] = useState(undefined)
    useEffect(() => {
        if (role === "student") {
            getStudentAverageScore().then(res => {
                setAvgScore(res.averageScore)
            })
            getUserCourses().then(res => {
                res.courses.map((studentCourse: { course: any }) => {
                    const courseId = studentCourse.course?._id
                    if(courseId) {
                        getCourseCompletionRate(courseId).then(res => {
                            setCoursesProgress({
                                ...coursesProgress,
                                [studentCourse.course.title]: res.completionRate
                            })
                        })
                        getStudentPerformanceMetric(courseId).then(res => {
                            console.log(res);
                            setCoursesMatrix({
                                ...coursesMatrix,
                                [studentCourse.course.title]: res.performanceMetric
                            })
                        })
                    }
                })
            })
        } else {
            downloadAnalytics().then(res => {
                setcsvButton(res)
            })

            getQuizzesByInstructor().then(res => {
                setquizzesInfo(res)
            })

            getContentEffectivenessAnalytics().then(res => {
                setconetntEffectivness(res)
            })

            getStudentEngagementAnalytics().then(res => {
                setcomponentsCard(res)
            })
        }
    }, [])
    return (
        <div className="mt-8">
            {role === "student" ? (
                <>
                    {avgScore === undefined ? (
                        <p>Loading...</p>
                    ) : (
                        <p>My average score is {avgScore}</p>
                    )}
                    <hr className="my-4" />
                    <h3>Courses Completion Rates</h3>
                    {Object.entries(coursesProgress).map(([courseName, score]) => (
                        <div key={courseName}>
                            <p key={courseName}><b>{courseName}</b></p>
                            <div className="mt-2">
                                <div className="bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{ width: `${(score / 100) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    {((score / 100) * 100).toFixed(0)}% completed
                                </p>
                            </div>
                        </div>
                    ))}
                    <hr className="my-4" />
                    <h3>Courses Progress Matrix</h3>
                    {Object.entries(coursesMatrix).map(([courseName, score]) => (
                        <div key={courseName}>
                            <p key={courseName}><b>{courseName}</b></p>

                            <div className="mt-2">
                                <div className="bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{ width: `${(score / 100) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    {((score / 100) * 100).toFixed(0)}% completed
                                </p>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <>
                    <h2>Analytics Data</h2>
                    <DownloadCSVButton csvData={csvButton} fileName="Analytics" />
                    <div className="my-4" />
                    <div className="flex flex-wrap gap-2">
                        {conetntEffectivness.map((course, index) => (
                            <ContentEffectivnessCard key={index} course={course} />
                        ))}
                        {componentsCard.map((data, index) => (
                            <PerformanceCard key={index} data={data} />
                        ))}
                        {quizzesInfo.map((data, index) => (
                            <QuizzesCard key={index} data={data} />
                        ))}
                    </div>
                </>
            )}

        </div>
    );
}
