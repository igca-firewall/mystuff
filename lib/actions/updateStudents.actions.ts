"use server"
import { Query } from "appwrite";
import { createAdminClient } from "../appwrite";


const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const STUDENTS_COLLECTION_ID = process.env.  APPWRITE_STUDENTS_COLLECTION_ID;
const SCORES_COLLECTION_ID = process.env.APPWRITE_SCORES_COLLECTION_ID;
const {
    //     APPWRITE_POST_COLLECTION_ID: POST_COLLECTION_ID,
    //     APPWRITE_STORAGE_ID: STORAGE_ID,
    APPWRITE_COMPILED_ID : COMPILED_RESULTS_ID,
    
    //     NEXT_PUBLIC_APPWRITE_ENDPOINT: ENDPOINT,
    //     NEXT_PUBLIC_APPWRITE_PROJECT: PROJECT_ID,
         APPWRITE_STUDENTS_COLLECTION_ID: APPWRITE_STUDENTS_COLLECTION_ID,
    APPWRITE_RESULT_COLLECTION_ID: RESULTS_ID,
    //     APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
    //     APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTIONS_ID,
    APPWRITE_SCORES_COLLECTION_ID: SCORES_ID,
    //     APPWRITE_SCRATCHCARD_COLLECTION_ID: SCRATCHCARD_COLLECION_ID,
    // APPWRITE_SUBJECT_COLLECTION_ID: SUBJECTS_ID,
  } = process.env;
  
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

export const updateScoresWithClassRoom = async () => {
    const { database } = await createAdminClient();
  
    // Step 1: List all students
    const students = await listAllDocuments(STUDENTS_COLLECTION_ID!);
  
    // Step 2: Create a mapping of student IDs to classRoom values
    const studentClassRoomMap = students.reduce((map, student) => {
      map[student.studentId] = student.classRoom; // Map studentId to classRoom
      return map;
    }, {} as Record<string, string>);
  
    // Step 3: List all scores
    const scores = await listAllDocuments(SCORES_COLLECTION_ID!);
  
    // Step 4: Update each score's classRoom field based on the studentId
    for (const score of scores) {
      const studentId = score.studentId; // Get the studentId from the score document
  
      // Check if the student has a classRoom in the studentClassRoomMap
      if (studentClassRoomMap[studentId]) {
        try {
          // Update the score document with the classRoom from the student
          await database.updateDocument(
            DATABASE_ID!,
            SCORES_COLLECTION_ID!,
            score.$id,
            {
              classRoom: studentClassRoomMap[studentId], // Update the classRoom field in the score document
            }
          );
          console.log(`Updated score ${score.$id} with classRoom ${studentClassRoomMap[studentId]}`);
        } catch (error) {
          console.error(`Failed to update score ${score.$id}:`, error);
        }
      } else {
        console.warn(`No matching student found for score ${score.$id} with studentId ${studentId}`);
      }
    }
  };
  
export const listAllScores = async () => {
    const { database } = await createAdminClient();
  
    const limit = 10001;
    const maxRecords = 100001;
    let allDocuments: any[] = [];
    let offset = 0;
    let totalFetched = 0;
  
    while (totalFetched < maxRecords) {
      const response = await database.listDocuments(
        DATABASE_ID!,
        SCORES_COLLECTION_ID!,
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
  