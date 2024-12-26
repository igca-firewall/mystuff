"use client"
import { listAllScores, updateScoresWithClassRoom } from "@/lib/actions/updateStudents.actions";
import React, { useState } from "react";


// Define the UpdateScoresComponent
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
const UpdateScoresComponent: React.FC = () => {
  // Manage various states that reflect the process
  const [isLoading, setIsLoading] = useState(false);        // Loading state for UI
  const [updatedCount, setUpdatedCount] = useState(0);       // Track how many scores have been updated
  const [totalScores, setTotalScores] = useState(0);         // Total number of scores to be updated
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Store any error message
  const [isSuccess, setIsSuccess] = useState(false);         // Track success status
  const [isFailure, setIsFailure] = useState(false);         // Track failure status

  // Helper function to auto-close success/failure popup
  const autoClosePopup = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setTimeout(() => setter(false), 3000); // Close after 3 seconds
  };

  // The main update function that starts the update process
  const startUpdateProcess = async () => {
    setIsLoading(true);  // Set loading state to true when starting
    setUpdatedCount(0);   // Reset updated count
    setErrorMessage(null); // Clear previous error messages
    setIsSuccess(false);  // Reset success state
    setIsFailure(false);  // Reset failure state

    try {
      // Fetch total scores and start the update process
      const scores = await listAllScores(); // Get all scores to update
      setTotalScores(scores.length);        // Set the total number of scores to be updated

      // Execute the actual update operation
      const updatedScores = await updateScoresWithClassRoom(); // Call the update function
      
      // After completion, update the count and show success
      setUpdatedCount(updatedScores);  // Update the count of updated scores
      setIsSuccess(true);  // Show success state
      autoClosePopup(setIsSuccess); // Automatically close success popup after 3 seconds

      console.log("Update process completed successfully!");
    } catch (error) {
      console.error("Error during the update process:", error);  // Log the error in the console
      setIsLoading(false);  // End loading state on error
      setErrorMessage("An error occurred while updating the scores.");  // Set error message
      setIsFailure(true);   // Show failure state
      autoClosePopup(setIsFailure); // Automatically close failure popup after 3 seconds
    } finally {
      setIsLoading(false);  // End loading state after everything finishes
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Heading */}
      <h2 className="text-xl font-bold text-center mb-4">Update Scores</h2>

      {/* Loading State */}
      {isLoading ? (
        <div>
          <p className="text-center mb-2">Updating scores... Please wait.</p>
          <div className="w-full bg-gray-200 h-2 mb-4 rounded-full">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${(updatedCount / totalScores) * 100}%`, // Dynamically update the progress bar
              }}
            ></div>
          </div>
          <p className="text-center">{updatedCount} / {totalScores} updated</p> {/* Show the current count of updated scores */}
        </div>
      ) : (
        <div>
          {/* Success and Failure Messages */}
          {isSuccess && (
            <p className="text-green-500 text-center">Update completed successfully!</p>
          )}
          {isFailure && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}
        </div>
      )}

      {/* Start Update Button */}
      {!isLoading && !isSuccess && !isFailure && (
        <div className="text-center mt-4">
          <button
            onClick={startUpdateProcess}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Start Update
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateScoresComponent;
