"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Models } from "node-appwrite";
import { getStudentsByClass } from "@/lib/actions/studentsData.actions";
import Select from "./CustomSelect";
import { classOrder } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import {
  uploadResults,
  fetchResultWithSubject,
} from "@/lib/actions/rexults.actions";

// Interfaces for student and result data
interface Student {
  $id: string;
  name: string;
  studentId: string;
}

interface Result {
  studentId: string;
  studentName: string;
  grades: string[];
  sum: number;
  grade: string;
}
interface Scores {
  $id: string;
  firstTest: string;
  secondTest: string;
  bnb: string;
  project: string;
  assignment: string;
  exam: string;
  subject: string;
  total: string;
  grade: string;
  session: string;
  term: string;
  createdAt: string;
  studentId: string;
  grades: string[];
}
// Grading function
const calculateGrade = (sum: number): string => {
  if (sum >= 80) return "A1";
  if (sum >= 70) return "B2";
  if (sum >= 60) return "B3";
  if (sum >= 50) return "C4";
  if (sum >= 45) return "C5";
  if (sum >= 40) return "C6";
  if (sum >= 35) return "D7";
  if (sum >= 30) return "E8";
  return "F9";
};

const SubjectResultUploader: React.FC = () => {
  const [subject, setSubject] = useState<string>("");
  const [classRoom, setClassRoom] = useState<string>("");
  const [term, setTerm] = useState<string>("");
  const [session, setSession] = useState<string>(""); // State for Term
  const [results, setResults] = useState<Result[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const { user } = useUserContext();
  const [scores, setScores] = useState<Scores[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // Processing state for submit button
  const [errors, setErrors] = useState<string[]>([]); // Error state
  // New state for processing status
  const [isSuccess, setIsSuccess] = useState(false); // State for success popup
  const [isFailure, setIsFailure] = useState(false); // State for failure popup
  const [errorMessage, setErrorMessage] = useState(""); // State for storing error message
  const [completedSubmissions, setCompletedSubmissions] = useState(0);
  const [total, setTotal] = useState(0);
  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!classRoom) newErrors.push("Class is required.");
    if (!subject) newErrors.push("Subject is required.");
    if (!term) newErrors.push("Term is required.");
    if (!session) newErrors.push("Session is required.");
    // Check if all students have grades
    const allGradesEntered = results.every((result) =>
      result.grades.every((grade) => grade.trim() !== "")
    );
    if (!allGradesEntered) {
      newErrors.push("Please enter grades for all students.");
    }

    if (results.length === 0)
      newErrors.push("At least one result must be added.");

    setErrors(newErrors);
    return newErrors.length === 0;
  };
  const autoClosePopup = (
    setState: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setTimeout(() => setState(false), 3000);
  };
  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Add extensive state handling
    setIsProcessing(true);
    setIsSuccess(false); // Reset before submission
    setIsFailure(false); // Reset before submission
    setCompletedSubmissions(0);

    const uploadErrors: string[] = [];
    const successfulUploads: string[] = [];

    try {
      for (const result of results) {
        // Destructure grades to map them to respective fields
        const [firstTest, secondTest, project, bnb, assignment, exam] =
          result.grades;

        // Prepare the result data for the upload
        const uploadData = {
          id: result.studentId,
          firstTest: firstTest || "0",
          secondTest: secondTest || "0",
          project: project || "0",
          bnb: bnb || "0",
          assignment: assignment || "0",
          exam: exam || "0",
          result: `${result.sum}`,
          classRoom,
          term,
          session,
          grade: result.grade,
          subject,
          createdBy: user.$id,
          total: `${result.sum}`,
        };

        try {
          // Call the uploadResults function
          const uploadResponse = await uploadResults(uploadData);

          if (uploadResponse) {
            successfulUploads.push(result.studentName);
            // Clear the result from state if successfully uploaded
            setResults((prevResults) =>
              prevResults.filter((r) => r.studentId !== result.studentId)
            );
            setCompletedSubmissions((prev) => prev + 1);
            setIsSuccess(true); // Show success popup for this submission
            autoClosePopup(setIsSuccess); // Close success popup after 3 seconds
          } else {
            throw new Error(
              `Failed to upload result for ${result.studentName}`
            );
          }
        } catch (error) {
          console.error(
            `Error uploading result for ${result.studentName}:`,
            error
          );
          uploadErrors.push(result.studentName);
          setIsFailure(true); // Handle individual failure
          autoClosePopup(setIsFailure); // Close failure popup after 3 seconds
        }
      }

      if (uploadErrors.length > 0) {
        setErrors([
          ...errors,
          `Failed to upload results for: ${uploadErrors.join(", ")}`,
        ]);
      } else {
        console.log("All results uploaded successfully.");
        setClassRoom("");
        setSubject("");
        setTerm("");
        setResults([]);
        setSession("");
      }

      if (successfulUploads.length > 0) {
        // Show success page for the successful uploads
        console.log(
          `Successfully uploaded results for: ${successfulUploads.join(", ")}`
        );
      }
    } catch (error) {
      console.error("Unexpected error during submission:", error);
      setErrors((prev) => [
        ...prev,
        "An unexpected error occurred. Please try again.",
      ]);
      setIsFailure(true); // Handle any other errors
      autoClosePopup(setIsFailure); // Close failure popup after 3 seconds
    } finally {
      setIsProcessing(false); // Reset processing state
    }
  };

  // Handle adding results for a student
  const handleAddResult = (studentId: string, grades: string[]) => {
    if (grades.some((grade) => grade.trim() === "")) {
      setErrors((prevErrors) => [
        ...prevErrors,
        "Please enter all test scores for the student.",
      ]);
      return;
    }

    const student = students.find((student) => student.studentId === studentId);
    if (student) {
      const sum = grades.reduce(
        (acc, grade) => acc + (parseFloat(grade) || 0),
        0
      );
      const grade = calculateGrade(sum);

      const updatedResults = [...results];
      const existingResultIndex = updatedResults.findIndex(
        (result) => result.studentId === studentId
      );

      if (existingResultIndex !== -1) {
        updatedResults[existingResultIndex] = {
          ...updatedResults[existingResultIndex],
          grades,
          sum,
          grade,
        };
      } else {
        updatedResults.push({
          studentId,
          studentName: student.name,
          grades,
          sum,
          grade,
        });
      }

      setResults(updatedResults);
    }
  };
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const xed: Models.Document[] = await getStudentsByClass({ classRoom });
        if (xed) {
          const transformedStudents = xed.map((student) => ({
            $id: student.$id,
            name: student.name,
            studentId: student.studentId,
          }));
          setStudents(transformedStudents);
          console.log(transformedStudents, students);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (classRoom && term && session && subject) {
      fetchStudents();
    }
  }, [classRoom, term, session, subject]);
  useEffect(() => {
    const fetchStudentsScore = async () => {
      try {
        setIsLoading(true);
        const particles = await fetchResultWithSubject({
          classRoom,
          // id: students,
          term,
          session,
          subject,
        });
        if (particles) {
          const transformedScores = particles.map((scores) => ({
            $id: scores.$id,
            firstTest: scores.firstTest,
            secondTest: scores.secondTest,
            bnb: scores.bnb,
            project: scores.project,
            assignment: scores.assignment,
            exam: scores.exam,
            subject: scores.subject,
            total: scores.total,
            grade: scores.grade,
            session: scores.session,
            term: scores.term,
            createdAt: scores.$createdAt,
            studentId: scores.studentId,

            grades: [
              scores.firstTest,
              scores.secondTest,
              scores.bnb,
              scores.project,
              scores.assignment,
              scores.exam,
            ],
          }));
          setScores(transformedScores);
          console.log("FEtched scores", transformedScores);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (classRoom && subject && session && term && students) {
      fetchStudentsScore();
    }
  }, [classRoom, subject, session, term, students]);
  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-full bg-red-100 p-6 rounded-lg shadow-lg">
        <div className="text-center text-red-600 font-semibold text-xl md:text-2xl">
          <h2>You do not have access to this page.</h2>
          <p className="mt-2 text-gray-600">
            Please contact the administrator for assistance.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-start bg-gray-50 dark:bg-neutral-900 p-8">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-200 transition duration-200">
        Upload Results
      </h2>

      {/* Display Errors */}
      {errors.length > 0 && (
        <div className="mb-4 w-full bg-red-100 text-red-800 p-4 rounded-md">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Select Class, Subject, and Term */}
      <div className="flex flex-wrap justify-between gap-5 w-full mb-8">
        <div className="mb-5 w-full sm:w-1/3">
          <label
            htmlFor="classRoom"
            className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2"
          >
            Select Class
          </label>
          <Select
            options={classOrder.map((className) => ({
              value: className,
              label: className,
            }))}
            value={classRoom}
            onChange={(value) => setClassRoom(value)}
            placeholder="Choose a Class"
            className="w-full border-2 border-gray-300 dark:border-neutral-700 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div className="mb-5 w-full sm:w-1/3">
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2"
          >
            Select Subject
          </label>
          <Select
            options={[
              { value: "Math", label: "Math" },
              { value: "Science", label: "Science" },
              { value: "English", label: "English" },
              { value: "History", label: "History" },
              { value: "Geography", label: "Geography" },
            ]}
            value={subject}
            onChange={(value) => setSubject(value)}
            placeholder="Choose a Subject"
            className="w-full border-2 border-gray-300 dark:border-neutral-700 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div className="mb-5 w-full sm:w-1/3">
          <label
            htmlFor="term"
            className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2"
          >
            Select Term
          </label>
          <Select
            options={[
              { value: "1st Term", label: "1st Term" },
              { value: "2nd Term", label: "2nd Term" },
              { value: "3rd Term", label: "3rd Term" },
            ]}
            value={term}
            onChange={(value) => setTerm(value)}
            placeholder="Choose a Term"
            className="w-full border-2 border-gray-300 dark:border-neutral-700 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div className="mb-5 w-full sm:w-1/3">
          <label
            htmlFor="term"
            className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2"
          >
            Select Session
          </label>
          <Select
            options={[
              {
                value: ` ${currentYear}/${nextYear}`,
                label: `${currentYear}/${nextYear}`,
              },
            ]}
            value={session}
            onChange={(value) => setSession(value)}
            placeholder="Choose a Session"
            className="w-full border-2 border-gray-300 dark:border-neutral-700 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Student Result Table */}
      {/* Student Result Table */}
      <div className="w-full overflow-x-auto flex-grow p-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
          Add Student Results
        </label>

        {isLoading ? (
          <div className="flex justify-center items-center h-full bg-gray-50">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-dotted rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading...</p>
            </div>
          </div>
        ) : (
          <table className="min-w-full table-auto border-collapse bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-100 dark:bg-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  {`1st Summarize Test (10%)`}
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  {`2nd Summarize Test (10%)`}
                </th>{" "}
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  {`Assignment (10%)`}
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  {` Midterm Project (10%)`}
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  {`Book and Beyond (20%)`}
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  {`Exam (40%)`}
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sum
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                const studentResult = results.find(
                  (result) => result.studentId === student.studentId
                );
                return (
                  <tr
                    key={student.studentId}
                    className="border-b border-gray-200 dark:border-neutral-700"
                  >
                    <td className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {student.name}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {student.studentId}
                    </td>

                    {/* Grade Inputs */}
                    {[
                      "firstTest",
                      "secondTest",
                      "assignment",
                      "project",
                      "bnb",
                      "exam",
                    ].map((field, idx) => (
                      <td key={idx} className="px-6 py-3">
                        <Input
                          type="number"
                          placeholder={field.split(/(?=[A-Z])/).join(" ")}
                          value={studentResult?.grades[idx] || ""}
                          onChange={(e) => {
                            const newGrades = [
                              ...(studentResult?.grades || []),
                            ];
                            newGrades[idx] = e.target.value;
                            handleAddResult(student.studentId, newGrades);
                          }}
                          className="w-full text-sm text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-neutral-700 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        />
                      </td>
                    ))}
                    <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
                      {studentResult ? studentResult.sum : "-"}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
                      {studentResult ? studentResult.grade : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Submit Button */}
      <div className="w-full text-center mt-6">
        <button
          onClick={handleSubmit}
          className="bg-purple-500 text-white py-6 px-10 rounded-full hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 disabled:bg-gray-300"
          disabled={
            isProcessing ||
            !classRoom ||
            !subject ||
            !term ||
            results.length === 0
          }
        >
          {isProcessing ? "Submitting..." : "Submit Results"}
        </button>
      </div>
    </div>
  );
};

export default SubjectResultUploader;
