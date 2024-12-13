"use client"
// Import necessary libraries and components
// Import necessary libraries and components
import React, { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";
import { useUserContext } from "@/context/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Define Typescript types
interface Student {
  id: string;
  name: string;
  dateOfBirth: string;
  classRoom: string;
  guardianInvolved: boolean;
}

interface ClassData {
  [classRoom: string]: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

// Mock data fetch function (replace with real API calls)
const fetchStudents = async (): Promise<Student[]> => {
  return [
    { id: "1", name: "Alice", dateOfBirth: "2010-06-15", classRoom: "5A", guardianInvolved: true },
    { id: "2", name: "Bob", dateOfBirth: "2011-07-20", classRoom: "5B", guardianInvolved: false },
    { id: "3", name: "Charlie", dateOfBirth: "2010-08-12", classRoom: "5A", guardianInvolved: true },
    // Add more mock data...
  ];
};

const Dashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classData, setClassData] = useState<ClassData>({});
  const [loading, setLoading] = useState(true);
const {user} = useUserContext()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allStudents = await fetchStudents();
        setStudents(allStudents);

        const classCount: ClassData = allStudents.reduce((acc, student) => {
          acc[student.classRoom] = (acc[student.classRoom] || 0) + 1;
          return acc;
        }, {} as ClassData);

        setClassData(classCount);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center text-purple-700 font-bold">Loading...</div>;

  // Prepare chart data
  const barData: ChartData = {
    labels: Object.keys(classData),
    datasets: [
      {
        label: "Students per Class",
        data: Object.values(classData),
        backgroundColor: "rgba(138, 43, 226, 0.2)",
        borderColor: "rgba(138, 43, 226, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ["Guardian Involved", "Guardian Not Involved"],
    datasets: [
      {
        data: [
          students.filter((s) => s.guardianInvolved).length,
          students.filter((s) => !s.guardianInvolved).length,
        ],
        backgroundColor: ["#8a2be2", "#d8bfd8"],
        hoverBackgroundColor: ["#7a1ca1", "#c6a0c6"],
      },
    ],
  };

  const lineData = {
    labels: students.map((s) => s.name),
    datasets: [
      {
        label: "Date of Birth (Age Representation)",
        data: students.map((s) => new Date().getFullYear() - new Date(s.dateOfBirth).getFullYear()),
        fill: false,
        backgroundColor: "#8a2be2",
        borderColor: "#8a2be2",
      },
    ],
  };
if( user.role !== "admin" &&
  (
    
  )
)
  return (
    <div className="p-6 space-y-8 bg-purple-50 min-h-screen">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-purple-500">
          <h2 className="text-xl font-semibold text-purple-700">Total Students</h2>
          <p className="text-3xl font-bold text-purple-900">{students.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-purple-500">
          <h2 className="text-xl font-semibold text-purple-700">Classes</h2>
          <p className="text-3xl font-bold text-purple-900">{Object.keys(classData).length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-purple-500">
          <h2 className="text-xl font-semibold text-purple-700">Recent Additions</h2>
          <ul className="list-disc list-inside text-purple-900">
            {students.slice(0, 4).map((student) => (
              <li key={student.id}>{student.name}</li>
            ))}
          </ul>
          {students.length > 4 && (
            <p className="text-purple-700 mt-2">{students.length - 4} more...</p>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Students Per Class</h2>
          <Bar data={barData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Guardian Involvement</h2>
          <Pie data={pieData} />
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-purple-700 mb-4">Age Distribution</h2>
        <Line data={lineData} />
      </div>

      {/* Student Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-purple-700 mb-4">Student List</h2>
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-purple-100">
            <tr>
              <th className="px-4 py-2 border border-gray-200 text-purple-900">Name</th>
              <th className="px-4 py-2 border border-gray-200 text-purple-900">Class</th>
              <th className="px-4 py-2 border border-gray-200 text-purple-900">DOB</th>
              <th className="px-4 py-2 border border-gray-200 text-purple-900">Guardian</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-purple-50">
                <td className="px-4 py-2 border border-gray-200 text-purple-800">{student.name}</td>
                <td className="px-4 py-2 border border-gray-200 text-purple-800">{student.classRoom}</td>
                <td className="px-4 py-2 border border-gray-200 text-purple-800">{student.dateOfBirth}</td>
                <td className="px-4 py-2 border border-gray-200 text-purple-800">
                  {student.guardianInvolved ? "Involved" : "Not Involved"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
