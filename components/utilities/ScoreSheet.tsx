import React, { useState } from 'react';

const InputForm = () => {
  // List of 16 IGCSE subjects
  const subjects = [
    'English Language', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'Computer Science', 'Economics', 'Business Studies', 'History', 'Geography',
    'Art & Design', 'Physical Education', 'Foreign Language (French, Spanish)', 
    'Religious Studies', 'Design & Technology', 'Music'
  ];

  // Initialize state for a 16x10 table (16 subjects, 10 students) with empty scores
  const [scores, setScores] = useState(
    Array.from({ length: 16 }, () =>
      Array.from({ length: 10 }, () => '')
    )
  );

  // Handle input change for each individual cell
  const handleChange = (row: number, col: number, value: string) => {
    // Copy the current scores array
    const updatedScores = [...scores];
    
    // Update the specific cell value
    updatedScores[col][row] = value;

    // Update the state with the new values
    setScores(updatedScores);
  };

  // Handle form submission (you can modify this to suit your needs)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted Scores:', scores);
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Result Sheet</h2>
      <form onSubmit={handleSubmit}>
        <table className="table-auto w-full text-left border-collapse border-4 border-gray-700 rounded-lg">
          <thead>
            <tr>
              <th className="border-2 border-gray-700 px-4 py-2 rounded-lg">Subject</th>
              {/* Render rows for each student */}
              {Array.from({ length: 10 }).map((_, rowIndex) => (
                <th key={rowIndex} className="border-2 border-gray-700 px-4 py-2 rounded-lg">
                  Student {rowIndex + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Render columns for each subject */}
            {scores.map((col, colIndex) => (
              <tr key={colIndex}>
                {/* Render subject name */}
                <td className="border-2 border-gray-700 px-4 py-2 rounded-lg">
                  {subjects[colIndex]}
                </td>

                {/* Render each input field for students (as columns) */}
                {col.map((score, rowIndex) => (
                  <td key={rowIndex} className="border-2 border-gray-700 px-4 py-2">
                    <input
                      type="text"
                      value={score}
                      onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                      placeholder="Enter score"
                      className="w-full p-2 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="submit"
          className="mt-4 w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
          Submit Results
        </button>
      </form>
    </div>
  );
};

export default InputForm;
