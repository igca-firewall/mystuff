"use client";
import { useEffect, useState } from "react";
import { getStudentsByClass } from "@/lib/actions/studentsData.actions";
import { updateScoresWithClassRoom } from "@/lib/actions/updateStudents.actions";
import { Button } from "../ui/button";
import { classOrder } from "@/lib/utils";
import Select from "./CustomSelect";

const UpdateScoresComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false); // Loading state for UI
  const [updatedCount, setUpdatedCount] = useState(0); // Track how many scores have been updated
  const [totalScores, setTotalScores] = useState(0); // Total number of scores to be updated
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Store any error message
  const [isSuccess, setIsSuccess] = useState(false); // Track success status
  const [isFailure, setIsFailure] = useState(false); // Track failure status
  const [fetchingScores, setFetchingScores] = useState(false); // Track fetching state
  const [classRoom, setClassRoom] = useState<string>(""); // Selected classroom
  const [updateInProgress, setUpdateInProgress] = useState(false); // Track if update is in progress
  const [isShit, setIsShit] = useState(false); // Track whether the update is triggered
  const [scores, setScores] = useState<any[]>([]); // Store scores to be updated
  const [updatedStudents, setUpdatedStudents] = useState<Set<string>>(new Set()); // Track updated students

  // Helper function to auto-close success/failure popup
  const autoClosePopup = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setTimeout(() => setter(false), 3000); // Close after 3 seconds
  };

  // UseEffect to trigger the update once when the component mounts
  useEffect(() => {
    const startUpdateProcess = async () => {
      if (updateInProgress || !isShit) return; // Prevent multiple updates if one is already in progress or if `isShit` is false
  
      setIsLoading(true); // Set loading state to true when starting
      setUpdatedCount(0); // Reset updated count
      setErrorMessage(null); // Clear previous error messages
      setIsSuccess(false); // Reset success state
      setIsFailure(false); // Reset failure state
      setFetchingScores(true); // Set fetching state to true
      setUpdateInProgress(true); // Mark the update as in progress
  
      try {
        // Fetch total scores and start the update process
        const fetchedScores = await getStudentsByClass({ classRoom }); // Get all scores to update
        setTotalScores(fetchedScores.length); // Set the total number of scores to be updated
        console.log(`Total scores to update: ${fetchedScores.length}`); // Log total scores

        setScores(fetchedScores);
        setFetchingScores(false);

        if (fetchedScores.length === 0) {
          throw new Error("No scores available to update.");
        }
  
        // Keep track of updated students to avoid double submission
        const updatedScores = [...fetchedScores]; 
  
        // Sequentially update each student's score
        for (const score of updatedScores) {
          if (updatedStudents.has(score.id)) {
            continue; // Skip updating if this student has already been updated
          }
  
          try {
            // Perform the update operation for each score
            const result = await updateScoresWithClassRoom({ classRoom });
  
            if (result) {
              setUpdatedCount((prev) => prev + 1);
              setIsSuccess(true); // Show success popup for this submission
              setUpdatedStudents((prev) => new Set(prev).add(score.id)); // Add student to the updated list
              autoClosePopup(setIsSuccess); // Automatically close success popup after 3 seconds
            } else {
              setIsFailure(true); // Handle individual failure
              autoClosePopup(setIsFailure); // Automatically close failure popup after 3 seconds
            }
          } catch (error) {
            console.error("Error updating score:", error);
            setIsFailure(true);
            autoClosePopup(setIsFailure); // Automatically close failure popup after 3 seconds
            break; // Stop processing further scores if an error occurs
          }
        }
      } catch (error) {
        console.error("Error in the process:", error);
        setErrorMessage("An error occurred while updating scores.");
        setIsFailure(true); // Handle any other errors
        autoClosePopup(setIsFailure); // Automatically close failure popup after 3 seconds
      } finally {
        setIsLoading(false); // End loading state after everything finishes
        setUpdateInProgress(false); // Reset the update in progress flag
        setIsShit(false); // Reset `isShit` to prevent further updates
        setClassRoom(""); // Clear the classRoom state after completion
      }
    };
  
    if (classRoom && !updateInProgress && isShit) {
      startUpdateProcess(); // Call the update process when the component mounts
    }
  }, [classRoom, updateInProgress, isShit, updatedStudents]); // Dependency array includes classRoom, updateInProgress, and isShit

  return (
    <div className="w-full max-w-xl mx-auto bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
      {/* Heading */}
      <h2 className="text-xl font-bold text-center mb-4">Update Scores</h2>
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
      {/* Loading State */}
      {isLoading && !fetchingScores ? (
        <div>
          <p className="text-center mb-2">Updating scores... Please wait.</p>
          <div className="w-full  h-2 mb-4 rounded-full">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{
                width: `${(updatedCount / totalScores) * 100}%`, // Dynamically update the progress bar
              }}
            ></div>
          </div>
          <p className="text-center">
            {updatedCount} / {totalScores} updated
          </p>{" "}
          {/* Show the current count of updated scores */}
        </div>
      ) : (
        <div>
          {/* Success and Failure Messages */}
          {isSuccess && (
            <p className="text-green-500 text-center">
              Update completed successfully! {updatedCount} scores updated.
            </p>
          )}
          {isFailure && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}
        </div>
      )}

      {/* Fetching State */}
      {fetchingScores && (
        <p className="text-center text-purple-600">
          Fetching scores... Please wait.
        </p>
      )}
      <Button
        onClick={() => setIsShit(true)}
        className="px-7 py-6 rounded-full bg-purple-500"
      >
        {!isLoading && !fetchingScores && (
          <span className="ml-2 text-sm font-medium">
            {isShit ? "Updating..." : "Updating scores..."}{" "}
          </span>
        )}
      </Button>
    </div>
  );
};

export default UpdateScoresComponent;
