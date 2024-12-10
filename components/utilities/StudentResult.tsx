"use client"
import { fetchResult } from "@/lib/actions/rexults.actions";
import { getStudentById } from "@/lib/actions/studentsData.actions";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import ResultCard from "./StudentCard";
 // Component to display result details

const ResultPage = () => {
  const [result, setResult] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Replace with your actual query parameters or user inputs
  const query: ResultParams = {
    id: "IGCA/ETCHE/A8WK7U", // Replace with actual student ID
    classRoom: "JSS1A", // Replace with the classroom
    term: "3rd Term", // Replace with the term
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch result data
        const fetchedResult = await fetchResult(query);

        if (!fetchedResult) {
          setError("No results found for the provided details.");
          setIsLoading(false);
          return;
        }

        setResult(fetchedResult);

        // Fetch student data
        const fetchedStudent = await getStudentById(query.id);

        if (!fetchedStudent) {
          setError("No student found with the provided ID.");
          setIsLoading(false);
          return;
        }

        setStudent(fetchedStudent);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching the data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Student Result
        </h1>

        {error && <ErrorMessage message={error} />}

        {!error && result && student && (
          <ResultCard
            studentName={student.name}
            studentId={student.studentId}
            scores={result.scores}
            grade={result.grade}
            sum={result.total}
            classRoom={result.classRoom}
            term={result.term}
            subject={result.subject}
            additionalInfo={{
              age: student.age,
              parentContact: student.parentContact,
              address: student.address,
            }}
          />
        )}

        {!isLoading && !result && !error && (
          <p className="text-center text-gray-700">
            No data available for the provided query.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
