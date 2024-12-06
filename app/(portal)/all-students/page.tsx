"use client";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/AuthContext";
import {
  deleteStudent,
  listAllStudents,
} from "@/lib/actions/studentsData.actions";
import { Models } from "node-appwrite";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import ConfirmationModal from "@/components/utilities/CustomModal"; // Import the modal

interface Student {
  $id: string;
  name: string;
  dateOfBirth: string;
  studentId: string;
  classRoom: string;
}

const classOrder = [
  "JSS1A",
  "JSS1B",
  "JSS2A",
  "JSS2B",
  "JSS3A",
  "JSS3B",
  "SS1A",
  "SS1B",
  "SS2-Science",
  "SS2-Arts",
  "SS3-Science",
  "SS3-Arts",
];

const StudentList: React.FC = () => {
  const { user } = useUserContext();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState<"name" | "class">("name");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const limit = 100; // Fetch 100 students per page
        const offset = (currentPage - 1) * limit;

        const xed: Models.Document[] = await listAllStudents();

        if (xed) {
          const transformedStudents = xed.map((student) => ({
            $id: student.$id,
            name: student.name,
            dateOfBirth: student.dateOfBirth,
            studentId: student.studentId,
            classRoom: student.classRoom,
            createdAt: student.$createdAt
          }));

          setStudents(transformedStudents);
        }

        // Assuming total count of students is 10000, we calculate total pages
        setTotalPages(Math.ceil(10000 / limit));
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [currentPage]);

  const sortedStudents = [...students].sort((a, b) => {
    if (sortOption === "name") {
      return a.name.localeCompare(b.name);
    } else {
      return classOrder.indexOf(a.classRoom) - classOrder.indexOf(b.classRoom);
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-dotted rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!students.length) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-500">No students found</p>
        </div>
      </div>
    );
  }

  const handleEdit = (studentId: string) => {
    console.log("Edit student", studentId);
  };

  const handleDelete = (studentId: string) => {
    setStudentToDelete(studentId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (studentToDelete) {
      try {
        await deleteStudent({ id: studentToDelete });

        setStudents((prevStudents) =>
          prevStudents.filter((student) => student.$id !== studentToDelete)
        );
        console.log("Student deleted:", studentToDelete);
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
    setIsModalOpen(false);
  };

  const cancelDelete = () => {
    setStudentToDelete(null);
    setIsModalOpen(false);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 p-6 sm:p-8 flex flex-col">
      <div className="flex flex-col flex-1 bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Student List</h1>

        {/* Search and Sort Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-2/3">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, ID, or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort By:</label>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-purple-500"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as "name" | "class")}
            >
              <option value="name">Name (A-Z)</option>
              <option value="class">Class Order</option>
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-hidden rounded-lg shadow-md border border-gray-200 flex-1">
          <table className="w-full table-auto text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Student ID</th>
                <th className="px-4 py-3 text-left">Class</th>
                <th className="px-4 py-3 text-left">Date of Birth</th>
                {user?.role === "admin" && (
                  <th className="px-4 py-3 text-left">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedStudents
                .filter(
                  (student) =>
                    student.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    student.studentId
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    student.classRoom
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .map((student, index) => (
                  <tr
                    key={student.$id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition-all duration-300"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{student.name}</td>
                    <td className="px-4 py-2">{student.studentId}</td>
                    <td className="px-4 py-2">{student.classRoom}</td>
                    <td className="px-4 py-2">{student.dateOfBirth}</td>
                    {user?.role === "admin" && (
                      <td className="px-4 py-2 flex items-center gap-3">
                        <button
                          className="text-indigo-600 hover:text-indigo-700 transition-all duration-200"
                          onClick={() => handleEdit(student.$id)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-700 transition-all duration-200"
                          onClick={() => handleDelete(student.$id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="Are you sure you want to delete this student?"
      />
    </div>
  );
};

export default StudentList;
