"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";

const {
  //     APPWRITE_POST_COLLECTION_ID: POST_COLLECTION_ID,
  //     APPWRITE_STORAGE_ID: STORAGE_ID,
  APPWRITE_DATABASE_ID: DATABASE_ID,
  //     NEXT_PUBLIC_APPWRITE_ENDPOINT: ENDPOINT,
  //     NEXT_PUBLIC_APPWRITE_PROJECT: PROJECT_ID,
  //     APPWRITE_STUDENTS_COLLECTION_ID: APPWRITE_STUDENTS_COLLECTION_ID,
  APPWRITE_RESULT_COLLECTION_ID: RESULTS_ID,
  //     APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  //     APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTIONS_ID,
  APPWRITE_SCORES_COLLECTION_ID: SCORES_ID,
  //     APPWRITE_SCRATCHCARD_COLLECTION_ID: SCRATCHCARD_COLLECION_ID,
  // APPWRITE_SUBJECT_COLLECTION_ID: SUBJECTS_ID,
} = process.env;

export const fetchResult = async ({ classRoom, id, term }: ResultParams) => {
  const { database } = await createAdminClient();

  // Prepare query filters dynamically based on available parameters
  const queries = [];
  if (id) queries.push(Query.equal("studentId", id));
  if (classRoom) queries.push(Query.equal("classRoom", classRoom));
  if (term) queries.push(Query.equal("term", term));

  try {
    // Fetch results based on constructed queries
    const result = await database.listDocuments(
      DATABASE_ID!,
      RESULTS_ID!,
      queries
    );

    if (!result || !result.documents || result.documents.length === 0) {
      console.log("No results found:", result);
      return false;
    }

    console.log("Result retrieved successfully 😁😁😁", result);
    return parseStringify(result.documents);
  } catch (error) {
    console.error("Error fetching results:", error);
    return false;
  }
};

export const updateResults = async ({
  id,
  scores,
  classRoom,
  term,
}: {
  id: string;
  scores: string[];
  classRoom: string;
  term: string;
}) => {
  const { database } = await createAdminClient();

  const fetchedToUpdate = await fetchResult({
    classRoom: classRoom,
    id: id,
    term: term,
  });
  if (!fetchedToUpdate) {
    console.log("No document to update in results collection", fetchedToUpdate);
    return false;
  }
  const updatedResults = await database.updateDocument(
    DATABASE_ID!,
    RESULTS_ID!,
    fetchedToUpdate[0].$id,
    {
      scores,
    }
  );
  if (!updatedResults) {
    console.log(
      "Update of results failed rexults.actions.ts: ",
      updatedResults
    );
    return false;
  }
  console.log("Updated results", updatedResults);
};

export const uploadResults = async ({
  id,
  classRoom,
  term,
  grade,
  createdBy,
  subject,
  total,
  firstTest,
  secondTest,
  project,
  bnb,
  assignment,
  exam,
  result,
}: {
  id: string;
  classRoom: string;
  term: string;
  grade: string;
  createdBy: string;
  subject: string;
  total: string;
  firstTest: string;
  secondTest: string;
  project: string;
  bnb: string;
  assignment: string;
  exam: string;
  result: string;
}) => {
  const { database } = await createAdminClient();
  const SID = ID.unique();
  try {
    // Create the scores document
    const uploadScores = await database.createDocument(
      DATABASE_ID!,
      SCORES_ID!,
      SID, // Use SID here
      {
        firstTest,
        secondTest,
        project,
        bnb,
        assignment,
        subject,
        total,
        grade,
        exam,
        result: SID, // Store the same ID in the result field if necessary
      }
    );

    // Check if the scores document was created successfully
    if (!uploadScores || !uploadScores.$id) {
      console.error("Failed to upload scores.");
      return false;
    }

    // Use the ID of the uploaded scores document as a reference in the results document
    const upload = await database.createDocument(
      DATABASE_ID!,
      RESULTS_ID!,
      ID.unique(),
      {
        studentId: id,
        scores: [SID], // Wrap the single document ID in an array
        classRoom,
        term,
        createdBy,
      }
    );

    if (!upload) {
      console.error("Error uploading results", upload);
      return false;
    }

    console.log("Results uploaded successfully", upload);
    return parseStringify(upload);
  } catch (error) {
    console.error("Error in uploading results:", error);
    return false;
  }
};
