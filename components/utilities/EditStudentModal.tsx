// EditStudentModal.tsx
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
interface Student {
    $id: string;
    name: string;
    studentId: string;
    classRoom: string;
  }
  
interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSubmit: (student: Student) => void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({
  isOpen,
  onClose,
  student,
  onSubmit,
}) => {
  const [editedStudent, setEditedStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (student) {
      setEditedStudent(student);
    }
  }, [student]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedStudent) {
      setEditedStudent({ ...editedStudent, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedStudent) {
      onSubmit(editedStudent);
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Edit Student
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <Input
              type="text"
              name="name"
              value={editedStudent?.name}
              onChange={handleInputChange}
              className="w-full py-2 px-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Student ID</label>
            <Input
              type="text"
              name="studentId"
              value={editedStudent?.studentId}
              onChange={handleInputChange}
              className="w-full py-2 px-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Class</label>
            <Input
              type="text"
              name="classRoom"
              value={editedStudent?.classRoom}
              onChange={handleInputChange}
              className="w-full py-2 px-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 dark:text-gray-300 px-4 py-2 bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white bg-blue-600 px-4 py-2 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
