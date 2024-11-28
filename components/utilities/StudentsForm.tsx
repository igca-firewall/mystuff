import { inputStudentInfo } from "@/lib/actions/studentsData.actions";
import { generateStudentId } from "@/lib/utils";
import React, { useState, useRef } from "react";
import Select from "./CustomSelect";

const StudentForm = () => {
  // Initial state for managing student details
  const [students, setStudents] = useState(
    Array(1000).fill({
      fullName: "",
      dateOfBirth: "",
      parentInfo: "",
      classRoom: "JSS1A",
    })
  );

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // New state for processing status
  const [isSuccess, setIsSuccess] = useState(false); // State for success popup
  const [isFailure, setIsFailure] = useState(false); // State for failure popup
  const [errorMessage, setErrorMessage] = useState(""); // State for storing error message

  // Class options
  const classOptions = [
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
  
  // Transform the array into an array of Option objects
  const options = classOptions.map((classOption) => ({
    value: classOption,
    label: classOption,
  }));
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate paginated data
  const totalPages = Math.ceil(students.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentStudents = students.slice(startIndex, startIndex + itemsPerPage);

  // Refs for the input fields
  const fullNameRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const dobRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const parentInfoRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const classRefs = useRef<(HTMLSelectElement | null)[]>([]);

  // Capitalize the first letter of each word in a string
  const capitalizeWords = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };
  // Add this helper function outside the component
  const resetStudentState = () =>
    Array(1000).fill({
      fullName: "",
      dateOfBirth: "",
      parentInfo: "",
      classRoom: "JSS1A",
    });
  // Handle input changes
  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedStudents = [...students];
    const globalIndex = startIndex + index; // Adjust for pagination
    updatedStudents[globalIndex] = {
      ...updatedStudents[globalIndex],
      [field]: capitalizeWords(value),
    };
    setStudents(updatedStudents);
  };

  // Handle keydown to go to the next field on Enter press
  const handleKeyDown = (
    e: React.KeyboardEvent,
    index: number,
    field: string
  ) => {
    if (e.key === "Enter") {
      // Check if it's the last field in the row
      if (field === "classRoom") {
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1); // Move to next page if it's the last field
        }
      } else {
        // Move to the next input field in the row
        const nextField =
          field === "fullName"
            ? fullNameRefs
            : field === "dateOfBirth"
            ? dobRefs
            : field === "parentInfo"
            ? parentInfoRefs
            : classRefs;
        const nextIndex = index + 1;
        nextField?.current[nextIndex]?.focus(); // Focus on the next field
      }
    }
  };
  const [selectedValue, setSelectedValue] = useState("");
  const closeModal = () => {
    setIsModalOpen(false);
  };
  // Success and failure popup auto-close handler
  const autoClosePopup = (
    setState: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setTimeout(() => setState(false), 3000);
  };
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // const isValidClassRoom = (classRoom: string) => {
    //     return classOptions.includes(classRoom);
    //   };
    // Validate input data
    const populatedStudents = students.filter(
      (student) =>
        student.fullName.trim() !== "" &&
        student.dateOfBirth.trim() !== "" &&
        student.parentInfo.trim() !== ""
    );

    if (populatedStudents.length === 0) {
      alert("No valid student data found!");
      return;
    }
    console.log("students", populatedStudents,e)

    setIsProcessing(true); // Set processing to true before sending the data

    try {
      const currentDate = new Date();

      // Add 6 years to the current date
      currentDate.setFullYear(currentDate.getFullYear() + 6);

      // Format the date to a valid ISO 8601 string (e.g., "YYYY-MM-DDTHH:mm:ss")
      const expirationTime = currentDate
        .toISOString()
        .split(".")[0]
        .replace("T", " ");

      // Iterate over each student and call the inputStudentInfo function
      const results = await Promise.all(
        populatedStudents.map((student) =>
          inputStudentInfo({
            name: student.fullName,
            classRoom: student.classRoom,
            dateOfBirth: student.dateOfBirth,
            guardianInfo: student.parentInfo,
            expirationTime: expirationTime,
            studentId: `IGCA/ETCHE/${generateStudentId()}${generateStudentId()}`, // You can adjust this value
          })
        )
      );
      const allSuccessful = results.every((result) => result !== undefined);

      if (allSuccessful) {
        console.log("Students successfully added:", results, students);
        setStudents(resetStudentState()); // Reset form
        setIsSuccess(true); // Indicate success
        autoClosePopup(setIsSuccess); // Auto-close success popup
      } else {
        console.error("Some students failed to be added:", results);
        setIsFailure(true); // Indicate failure
        autoClosePopup(setIsFailure); // Auto-close failure popup
      }
    } catch (error) {
      console.error("Error submitting student info:", error);
      setIsFailure(true); // Handle failure
      autoClosePopup(setIsFailure); // Auto-close failure popup
    } finally {
      setIsProcessing(false); // Always stop processing
    }}

  // Handle pagination navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Open the modal for confirmation

  // Close the success popup
  const closeSuccessPopup = () => {
    setIsSuccess(false);
  };

  // Close the failure popup
  const closeFailurePopup = () => {
    setIsFailure(false);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Student Registration Form
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm">
          <table className="table-auto w-full text-sm">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">#</th>
                <th className="px-4 py-2 text-left font-semibold">Full Name</th>
                <th className="px-4 py-2 text-left font-semibold">
                  Date of Birth
                </th>
                <th className="px-4 py-2 text-left font-semibold">
                  Parent Info
                </th>
                <th className="px-4 py-2 text-left font-semibold">Class</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="px-4 py-2 text-gray-600 font-medium text-center">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-2">
                    <textarea
                      value={student.fullName}
                      onChange={(e) =>
                        handleInputChange(index, "fullName", e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(e, index, "fullName")}
                      placeholder="Full Name"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={1}
                      //   ref={(el) => (fullNameRefs.current[index] = el)}
                    ></textarea>
                  </td>
                  <td className="px-4 py-2">
                    <textarea
                      value={student.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange(index, "dateOfBirth", e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(e, index, "dateOfBirth")}
                      placeholder="YYYY-MM-DD"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={1}
                      //   ref={(el) => (dobRefs.current[index] = el)}
                    ></textarea>
                  </td>
                  <td className="px-4 py-2">
                    <textarea
                      value={student.parentInfo}
                      onChange={(e) =>
                        handleInputChange(index, "parentInfo", e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(e, index, "parentInfo")}
                      placeholder="Parent Info"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={1}
                      //   ref={(el) => (parentInfoRefs.current[index] = el)}
                    ></textarea>
                  </td>
                  <td className="px-4 py-2">
                    <Select
                      options={options}
                      value={selectedValue}
                      onChange={setSelectedValue}
                      placeholder="Select a class"
                      className="max-w-md"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Success Popup */}
        {isSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg text-center">
              <h2 className="text-xl font-semibold text-green-600">Success!</h2>
              <p className="text-gray-700">
                Student records have been successfully added.
              </p>
              <button
                onClick={closeSuccessPopup}
                className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Failure Popup */}
        {isFailure && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-red-100 p-6 rounded-lg text-center">
              <h2 className="text-xl font-semibold text-red-600">Failure!</h2>
              <p className="text-gray-700">{errorMessage}</p>
              <button
                onClick={closeFailurePopup}
                className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={goToPreviousPage}
            className="text-purple-500 bg-gray-300 px-5 py-2 rounded-full"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={goToNextPage}
            className="text-purple-500 bg-gray-300  px-5 py-2 rounded-full"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            type="submit"
            className="bg-purple-500 text-gray-100  px-6 py-4 rounded-full"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
