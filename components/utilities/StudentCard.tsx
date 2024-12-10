import React from "react";

interface ResultCardProps {
  studentName: string;
  studentId: string;
  grades: { 
    term: string;
    subjects: { [subject: string]: number };
    grade: string;
    sum: number;
  }[];
  classRoom: string;
  additionalInfo: {
    age?: number;
    parentContact?: string;
    address?: string;
  };
}

const ResultCard: React.FC<ResultCardProps> = ({
  studentName,
  studentId,
  grades,
  classRoom,
  additionalInfo,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Student: {studentName}</h2>
      <p className="text-sm text-gray-600 mb-2">ID: {studentId}</p>
      <p className="text-sm text-gray-600 mb-4">Class: {classRoom}</p>

      {additionalInfo && (
        <div className="mb-4">
          {additionalInfo.age && (
            <p className="text-sm text-gray-600">Age: {additionalInfo.age}</p>
          )}
          {additionalInfo.parentContact && (
            <p className="text-sm text-gray-600">
              Parent Contact: {additionalInfo.parentContact}
            </p>
          )}
          {additionalInfo.address && (
            <p className="text-sm text-gray-600">Address: {additionalInfo.address}</p>
          )}
        </div>
      )}

      {grades?.map((gradeDocument, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Term: {gradeDocument?.term} | Grade: {gradeDocument?.grade}
          </h3>

          <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left">Subject</th>
                {Object.keys(gradeDocument.subjects).map((subject) => (
                  <th key={subject} className="border border-gray-300 p-2 text-center">
                    {subject}
                  </th>
                ))}
                <th className="border border-gray-300 p-2 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">Scores</td>
                {Object.values(gradeDocument.subjects).map((score, index) => (
                  <td key={index} className="border border-gray-300 p-2 text-center">
                    {score}
                  </td>
                ))}
                <td className="border border-gray-300 p-2 text-center">{gradeDocument.sum}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ResultCard;
