import { fetchCompiledResults } from "@/lib/actions/rexults.actions";
import { useEffect, useState } from "react";

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
  // grades: string[];
}

const CompiledResults = () => {
  const [data, setData] = useState<Scores[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompiledResults = async () => { // Renamed function
      try {
        setLoading(true);
        setError(null);

        // Assuming `fetchCompiledResults` is imported to fetch data
        const response = await fetchCompiledResults(); 

        setData(response);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadCompiledResults();
  }, []);

  if (loading) {
    return <div>Loading compiled results...</div>;
  }

  if (error) {
    return <div>Error fetching results: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Compiled Results</h1>
      <table className="table-auto w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Student ID</th>
            <th className="px-4 py-2 border">Total Score</th>
            <th className="px-4 py-2 border">Average Score</th>
            <th className="px-4 py-2 border">Scores</th>
          </tr>
        </thead>
        <tbody>
          {data.map((result) => (
            <tr key={result.$id}>
              <td className="px-4 py-2 border">{result.studentId}</td>
              <td className="px-4 py-2 border">{result.total}</td>
              <td className="px-4 py-2 border">{(parseFloat(result.total) / 6).toFixed(2)}</td>
              <td className="px-4 py-2 border">
                {[
                  result.firstTest,
                  result.secondTest,
                  result.bnb,
                  result.project,
                  result.assignment,
                  result.exam,
                ].join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompiledResults;
