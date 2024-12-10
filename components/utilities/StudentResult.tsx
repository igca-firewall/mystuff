"use client";

import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf"; // Import jsPDF
import html2canvas from "html2canvas"; // Import html2canvas
import { fetchResult } from "@/lib/actions/rexults.actions";
import { getStudentById } from "@/lib/actions/studentsData.actions";
import { useParams } from "next/navigation";

interface Result {
  subject: string;
  scores: { [key: string]: number }; // Map each test type to a score
  total: string | null;
  grade: string;
}

interface Student {
  name: string;
  dateOfBirth: string;
  guardianInfo: string;
  studentId: string;
  classRoom: string;
  status: string;
  results: Result[];
}

const studentData: Student = {
  name: "Emmanuel Bethel",
  dateOfBirth: "2014-10-05",
  guardianInfo: "08038369664",
  studentId: "IGCA/ETCHE/A8WK7U",
  classRoom: "JSS1A",
  status: "notCreated",
  results: [
    {
      subject: "Math",
      scores: {
        "1st Test": 9,
        "2nd Test": 8,
        Midterm: 10,
        Project: 7,
        "Book and Beyond": 8,
        Exam: 9,
      },
      total: "85",
      grade: "A1",
    },
    {
      subject: "History",
      scores: {
        "1st Test": 8,
        "2nd Test": 7,
        Midterm: 8,
        Project: 8,
        "Book and Beyond": 9,
        Exam: 7,
      },
      total: "76",
      grade: "B2",
    },
  ],
};

const ResultSheet: React.FC = () => {
  const [teacherComment, setTeacherComment] = useState("");
  const [principalComment, setPrincipalComment] = useState("");
  const { id } = useParams();
  const singleId = Array.isArray(id) ? id[0] : id;
  const [result, setResult] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const downloadCSV = () => {
    const csvContent = [
      [
        "Subject",
        "1st Test",
        "2nd Test",
        "Midterm",
        "Project",
        "Book and Beyond",
        "Exam",
        "Total",
        "Grade",
      ],
      ...studentData.results.map((result) => [
        result.subject,
        result.scores["1st Test"] ?? "N/A",
        result.scores["2nd Test"] ?? "N/A",
        result.scores["Midterm"] ?? "N/A",
        result.scores["Project"] ?? "N/A",
        result.scores["Book and Beyond"] ?? "N/A",
        result.scores["Exam"] ?? "N/A",
        result.total || "N/A",
        result.grade,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_result_sheet.csv");
    link.click();
  };

  const printResultSheet = () => {
    const printWindow = window.open("", "_blank");
    printWindow?.document.write(
      "<html><head><title>Result Sheet</title></head><body>"
    );
    printWindow?.document.write(`
      <h1>Student Result Sheet</h1>
      <h2>Student Information</h2>
      <p><strong>Name:</strong> ${studentData.name}</p>
      <p><strong>Date of Birth:</strong> ${studentData.dateOfBirth}</p>
      <p><strong>Guardian Info:</strong> ${studentData.guardianInfo}</p>
      <p><strong>Student ID:</strong> ${studentData.studentId}</p>
      <p><strong>Classroom:</strong> ${studentData.classRoom}</p>
      <p><strong>Status:</strong> ${studentData.status}</p>
      <h2>Results</h2>
      <table border="1" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th>Subject</th>
            <th>1st Test</th>
            <th>2nd Test</th>
            <th>Midterm</th>
            <th>Project</th>
            <th>Book and Beyond</th>
            <th>Exam</th>
            <th>Total</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          ${studentData.results
            .map(
              (result) => `
                <tr>
                  <td>${result.subject}</td>
                  <td>${result.scores["1st Test"]}</td>
                  <td>${result.scores["2nd Test"]}</td>
                  <td>${result.scores["Midterm"]}</td>
                  <td>${result.scores["Project"]}</td>
                  <td>${result.scores["Book and Beyond"]}</td>
                  <td>${result.scores["Exam"]}</td>
                  <td>${result.total || "N/A"}</td>
                  <td>${result.grade}</td>
                </tr>`
            )
            .join("")}
        </tbody>
      </table>
    `);
    printWindow?.document.write("</body></html>");
    printWindow?.document.close();
    printWindow?.print();
  };

  const saveAsPDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("Student Result Sheet", 20, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${studentData.name}`, 20, 30);
    doc.text(`Date of Birth: ${studentData.dateOfBirth}`, 20, 40);
    doc.text(`Guardian Info: ${studentData.guardianInfo}`, 20, 50);
    doc.text(`Student ID: ${studentData.studentId}`, 20, 60);
    doc.text(`Classroom: ${studentData.classRoom}`, 20, 70);
    doc.text(`Status: ${studentData.status}`, 20, 80);

    doc.text("Results", 20, 90);
    let yOffset = 100;

    studentData.results.forEach((result) => {
      doc.text(`Subject: ${result.subject}`, 20, yOffset);
      doc.text(`1st Test: ${result.scores["1st Test"]}`, 20, yOffset + 10);
      doc.text(`2nd Test: ${result.scores["2nd Test"]}`, 20, yOffset + 20);
      doc.text(`Midterm: ${result.scores["Midterm"]}`, 20, yOffset + 30);
      doc.text(`Project: ${result.scores["Project"]}`, 20, yOffset + 40);
      doc.text(
        `Book and Beyond: ${result.scores["Book and Beyond"]}`,
        20,
        yOffset + 50
      );
      doc.text(`Exam: ${result.scores["Exam"]}`, 20, yOffset + 60);
      doc.text(`Total: ${result.total || "N/A"}`, 20, yOffset + 70);
      doc.text(`Grade: ${result.grade}`, 20, yOffset + 80);
      yOffset += 90;
    });

    // Adding Teacher and Principal Comments
    doc.text("Teacher's Comment:", 20, yOffset);
    doc.text(teacherComment || "No comment provided.", 20, yOffset + 10);
    yOffset += 30;

    doc.text("Principal's Comment:", 20, yOffset);
    doc.text(principalComment || "No comment provided.", 20, yOffset + 10);

    doc.save("student_result_sheet.pdf");
  };

  const saveAsImage = () => {
    const resultSection = document.getElementById("result-section"); // Select the part to capture

    if (resultSection) {
      html2canvas(resultSection).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "result_sheet.png";
        link.click();
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch result data
        const fetchedStudent = await getStudentById(singleId || "");
        const term = "1st Term";
        const fetchedResult = await fetchResult({
          classRoom: fetchedStudent?.classRoom,
          id: fetchedStudent?.$id,
          term: term,
        });

        if (!fetchedResult) {
          setError("No results found for the provided details.");
          setIsLoading(false);
          return;
        }

        setResult(fetchedResult);

        // Fetch student data

        if (!fetchedStudent) {
          setError("No student found with the provided ID.");
          setIsLoading(false);
          return;
        }

        setStudent(fetchedStudent);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          "An error occurred while fetching the data. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 py-10" id="result-section">
      <h1 className="text-4xl font-bold text-center mb-8">
        Student Result Sheet
      </h1>

      {/* Student Information Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Student Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <strong>Name:</strong>
            <p>{studentData.name}</p>
          </div>
          <div>
            <strong>Date of Birth:</strong>
            <p>{studentData.dateOfBirth}</p>
          </div>
          <div>
            <strong>Guardian Info:</strong>
            <p>{studentData.guardianInfo}</p>
          </div>
          <div>
            <strong>Student ID:</strong>
            <p>{studentData.studentId}</p>
          </div>
          <div>
            <strong>Classroom:</strong>
            <p>{studentData.classRoom}</p>
          </div>
          <div>
            <strong>Status:</strong>
            <p>{studentData.status}</p>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Results</h2>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Subject</th>
              <th className="border px-4 py-2">1st Test</th>
              <th className="border px-4 py-2">2nd Test</th>
              <th className="border px-4 py-2">Midterm</th>
              <th className="border px-4 py-2">Project</th>
              <th className="border px-4 py-2">Book and Beyond</th>
              <th className="border px-4 py-2">Exam</th>
              <th className="border px-4 py-2">Total</th>
              <th className="border px-4 py-2">Grade</th>
            </tr>
          </thead>
          <tbody>
            {studentData.results.map((result, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{result.subject}</td>
                <td className="border px-4 py-2">
                  {result.scores["1st Test"]}
                </td>
                <td className="border px-4 py-2">
                  {result.scores["2nd Test"]}
                </td>
                <td className="border px-4 py-2">{result.scores["Midterm"]}</td>
                <td className="border px-4 py-2">{result.scores["Project"]}</td>
                <td className="border px-4 py-2">
                  {result.scores["Book and Beyond"]}
                </td>
                <td className="border px-4 py-2">{result.scores["Exam"]}</td>
                <td className="border px-4 py-2">{result.total || "N/A"}</td>
                <td className="border px-4 py-2">{result.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Teacher's and Principal's Comments */}
      {/* <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Teacher's and Principal's Comments
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="teacher-comment" className="font-semibold">Teacher's Comment:</label>
            <textarea
              id="teacher-comment"
              value={teacherComment}
              onChange={(e) => setTeacherComment(e.target.value)}
              className="w-full p-4 border rounded-lg"
              rows={4}
              placeholder="Enter teacher's comment here"
            />
          </div>
          <div>
            <label htmlFor="principal-comment" className="font-semibold">Principal's Comment:</label>
            <textarea
              id="principal-comment"
              value={principalComment}
              onChange={(e) => setPrincipalComment(e.target.value)}
              className="w-full p-4 border rounded-lg"
              rows={4}
              placeholder="Enter principal's comment here"
            />
          </div>
        </div>
      </div> */}

      {/* Buttons */}
      <div className="text-center">
        <button
          onClick={saveAsPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
        >
          Download as PDF
        </button>
        <button
          onClick={saveAsImage}
          className="bg-green-500 text-white px-4 py-2 rounded mr-4"
        >
          Download as Image
        </button>
        <button
          onClick={downloadCSV}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Download as CSV
        </button>
      </div>
    </div>
  );
};

export default ResultSheet;
