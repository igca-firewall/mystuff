"use client";
import { useState } from "react";
import { getStudentsByClass } from "@/lib/actions/studentsData.actions";
import { listAllScores, updateScoresWithClassRoom } from "@/lib/actions/updateStudents.actions";
import { Button } from "../ui/button";
import { classOrder } from "@/lib/utils";
import Select from "./CustomSelect";

const UpdateScoresComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ updated: 0, total: 0 });
  const [status, setStatus] = useState<"idle" | "success" | "failure" | "fetching">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [classRoom, setClassRoom] = useState<string>("");
  const [updatedStudents, setUpdatedStudents] = useState<Set<string>>(new Set());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classRoom || isLoading) return;

    setIsLoading(true);
    setStatus("fetching");
    setErrorMessage(null);

    try {
      const fetchedScores = await getStudentsByClass({ classRoom });
      if (fetchedScores.length === 0) {
        throw new Error("No scores available to update.");
      } const studentClassRoomMap = fetchedScores.reduce((map, student) => {
        map[student.studentId] = student.classRoom;
        return map;
      }, {} as Record<string, string>);
    
      const allScores = await Promise.all(
        fetchedScores.map(async (student) => {
          const studentId = student.studentId;
          const scores = await listAllScores({ studentId });
          return scores
            .filter((score) => score.classRoom !== studentClassRoomMap[studentId]) // Filter scores that need updates
            .map((score) => ({
              id: score.$id,
              classRoom: studentClassRoomMap[studentId], // Map score to its updated classRoom
            }));
        })
      );
      setProgress({ total: allScores.length, updated: 0 });
      setStatus("idle");

      const updates = fetchedScores.map(async (score) => {
        if (!updatedStudents.has(score.id)) {
          const result = await updateScoresWithClassRoom({ classRoom });
          if (result) {
            setProgress((prev) => ({
              ...prev,
              updated: prev.updated + 1,
            }));
            setUpdatedStudents((prev) => new Set(prev).add(score.id));
          } else {
            throw new Error("Update failed for a score.");
          }
        }
      });

      await Promise.all(updates);
      setStatus("success");
    } catch (error) {
      console.error("Error updating scores:", error);
      setErrorMessage("An error occurred while updating scores.");
      setStatus("failure");
    } finally {
      setIsLoading(false);
      setClassRoom("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full max-w-xl mx-auto bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-center mb-4">Update Class</h2>
        <div className="mb-5 w-full">
          <label htmlFor="classRoom" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            Select Class
          </label>
          <Select
            options={classOrder.map((className) => ({ value: className, label: className }))}
            value={classRoom}
            onChange={(value) => setClassRoom(value)}
            placeholder="Choose a Class"
            className="w-full border-2 border-gray-300 dark:border-neutral-700 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {status === "fetching" && <p className="text-center text-purple-600">Fetching class... Please wait.</p>}
        {status === "idle" && isLoading && (
          <div>
            <p className="text-center mb-2">Updating class... Please wait.</p>
            <div className="w-full h-2 mb-4 bg-gray-200 rounded-full">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${(progress.updated / progress.total) * 100}%` }}
              ></div>
            </div>
            <p className="text-center">{progress.updated} / {progress.total} updated</p>
          </div>
        )}

        {status === "success" && (
          <p className="text-green-500 text-center">Update completed successfully! {progress.updated} class updated.</p>
        )}
        {status === "failure" && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}

        <Button
          type="submit"
          className="px-12 py-8 rounded-full bg-purple-500 text-white"
          disabled={!classRoom || isLoading}
        >
          {isLoading ? "Updating..." : "Update Class"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateScoresComponent;
