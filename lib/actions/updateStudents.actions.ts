"use server"
import { Query } from "appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { getStudentsByClass, listAllStudents } from "./studentsData.actions";


const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const STUDENTS_COLLECTION_ID = process.env.  APPWRITE_STUDENTS_COLLECTION_ID;
const SCORES_COLLECTION_ID = process.env.APPWRITE_SCORES_COLLECTION_ID;
// const {
//     //     APPWRITE_POST_COLLECTION_ID: POST_COLLECTION_ID,
//     //     APPWRITE_STORAGE_ID: STORAGE_ID,
//     APPWRITE_COMPILED_ID : COMPILED_RESULTS_ID,
    
//     //     NEXT_PUBLIC_APPWRITE_ENDPOINT: ENDPOINT,
//     //     NEXT_PUBLIC_APPWRITE_PROJECT: PROJECT_ID,
//          APPWRITE_STUDENTS_COLLECTION_ID: APPWRITE_STUDENTS_COLLECTION_ID,
//     APPWRITE_RESULT_COLLECTION_ID: RESULTS_ID,
//     //     APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
//     //     APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTIONS_ID,
//     APPWRITE_SCORES_COLLECTION_ID: SCORES_ID,
//     //     APPWRITE_SCRATCHCARD_COLLECTION_ID: SCRATCHCARD_COLLECION_ID,
//     // APPWRITE_SUBJECT_COLLECTION_ID: SUBJECTS_ID,
//   } = process.env;
  
export const listAllDocuments = async (collectionId: string) => {
  const { database } = await createAdminClient();

  const limit = 1000;
  const maxRecords = 10000;
  let allDocuments: any[] = [];
  let offset = 0;
  let totalFetched = 0;

  while (totalFetched < maxRecords) {
    const response = await database.listDocuments(
      DATABASE_ID!,
      collectionId,
      [
        Query.limit(limit),
        Query.offset(offset),
      ]
    );

    const documents = response.documents;

    allDocuments = [...allDocuments, ...documents];
    totalFetched += documents.length;

    if (documents.length < limit) {
      break;
    }

    offset += limit;
  }

  return allDocuments;
};
export const updateScoresWithClassRoom = async ({classRoom}:{classRoom: string}) => {
    const { database } = await createAdminClient();
  
    // Step 1: List all students
    const students = await getStudentsByClass({classRoom});
    console.log("AllStudents", students);
  
    // Step 2: Create a mapping of student IDs to classRoom values
    const studentClassRoomMap = students.reduce((map, student) => {
      map[student.studentId] = student.classRoom; // Map studentId to classRoom
      return map;
    }, {} as Record<string, string>);
  
    let updatedCount = 0; // Initialize updated count
  
    // Step 3: For each student, list their scores and update classRoom
    for (const student of students) {
      const studentId = student.studentId; // Get the studentId from the student record
  
      // Fetch scores for the specific student
      const scores = await listAllScores({ studentId });
  
      // Step 4: Update each score's classRoom field based on the studentId
      for (const score of scores) {
        // Check if the student has a classRoom in the studentClassRoomMap
        if (studentClassRoomMap[studentId]) {
          // Skip the update if the classRoom is already correct
          if (score.classRoom === studentClassRoomMap[studentId]) {
            console.log(`Score ${studentId} already has the correct classRoom. Skipping update.`);
            continue; // Skip this score and move to the next
          }
  
          try {
            // Update the score document with the classRoom from the student
         const aki= await database.updateDocument(
              DATABASE_ID!,
              SCORES_COLLECTION_ID!,
              score.$id,
              {
                classRoom: studentClassRoomMap[studentId], // Update the classRoom field in the score document
              }
            );
            if(aki)
            console.log(`Updated score ${studentId} with classRoom ${studentClassRoomMap[studentId]}`);
            updatedCount++; // Increment updated count
          } catch (error) {
            console.error(`Failed to update score ${score.$id}:`, error);
          }
        } else {
          console.warn(`No matching student found for score ${score.$id} with studentId ${studentId}`);
        }
      }
    }
  
    return updatedCount; // Return the count of updated scores
  };
  
  
  export const listAllScores = async ({ studentId }: { studentId: string }) => {
    const { database } = await createAdminClient();
  
    const limit = 3630; // Max number of documents per page
    const maxRecords = 3630; // Maximum number of records to fetch
    let allScores: any[] = []; // Array to hold all fetched scores
    let offset = 0; // Start from the first document
    let totalFetched = 0; // Keep track of how many records have been fetched
  
    while (totalFetched < maxRecords) {
      const newScoresInfo = await database.listDocuments(
        DATABASE_ID!,
        SCORES_COLLECTION_ID!,
        [
          Query.limit(limit), // Limit the number of students per request
          Query.offset(offset), // Skip the records we have already fetched
          Query.equal('studentId', [studentId]), // Filter scores by studentId
        ]
      );
  
      const scores = newScoresInfo.documents; // Get the documents (scores)
  
      allScores = [...allScores, ...scores]; // Append to the results array
      totalFetched += scores.length; // Update the total count of fetched students
  
      // If the number of documents returned is less than the limit, we've reached the end
      if (scores.length < limit) {
        break; // Exit the loop when there are no more scores to fetch
      }
  
      // Increment the offset for the next page
      offset += limit;
  
      // If we've already fetched the maximum number of students, exit the loop
      if (totalFetched >= maxRecords) {
        break;
      }
    }
  
    return allScores; // Return the full list of scores for the given studentId
  };
  