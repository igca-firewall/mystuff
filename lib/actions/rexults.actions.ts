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

  // Prepare query filters for the `RESULTS_ID` collection
  const resultQueries = [];
  if (id) resultQueries.push(Query.equal("studentId", id));
  if (classRoom) resultQueries.push(Query.equal("classRoom", classRoom));
  if (term) resultQueries.push(Query.equal("term", term));

  try {
    // Fetch results from the `RESULTS_ID` collection
    const resultData = await database.listDocuments(DATABASE_ID!, RESULTS_ID!, resultQueries);

    if (!resultData || !resultData.documents || resultData.documents.length === 0) {
      console.log("No results found:", resultData);
      return false;
    }

    console.log("Results metadata retrieved successfully:", resultData.documents);

    // Fetch scores for each result document
    const combinedResults = await Promise.all(
      resultData.documents.map(async (resultDoc) => {
        const scoresArray = resultDoc.scores; // Assumes `scores` is an array of IDs
        const scoresDetails = await Promise.all(
          scoresArray.map((scoreId: string) =>
            database.getDocument(DATABASE_ID!, SCORES_ID!, scoreId)
          )
        );

        return { ...resultDoc, scoresDetails };
      })
    );

    console.log("Combined results with scores retrieved successfully 😁😁😁", combinedResults);
    return parseStringify(combinedResults);
  } catch (error) {
    console.error("Error fetching results and scores:", error);
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
    // Create the scores document for the new subject
    const uploadScores = await database.createDocument(
      DATABASE_ID!,
      SCORES_ID!,
      SID,
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
        result: SID,
      }
    );

    if (!uploadScores || !uploadScores.$id) {
      console.error("Failed to upload scores.");
      return false;
    }

    // Check if the results document already exists for the student
    const existingResults = await database.listDocuments(
      DATABASE_ID!,
      RESULTS_ID!,
      [Query.equal("studentId", id), Query.equal("classRoom", classRoom), Query.equal("term", term)]
    );

    if (existingResults.total > 0) {
      // If results document exists, update the `scores` array
      const resultDoc = existingResults.documents[0];
      const updatedScores = [...(resultDoc.scores || []), SID];

      const updatedResult = await database.updateDocument(
        DATABASE_ID!,
        RESULTS_ID!,
        resultDoc.$id,
        { scores: updatedScores }
      );

      console.log("Updated results document successfully:", updatedResult);
      return parseStringify(updatedResult);
    } else {
      // If no results document exists, create a new one
      const upload = await database.createDocument(
        DATABASE_ID!,
        RESULTS_ID!,
        ID.unique(),
        {
          studentId: id,
          scores: [SID], // Initialize the `scores` array with the first subject
          classRoom,
          term,
          createdBy,
        }
      );

      if (!upload) {
        console.error("Error uploading results", upload);
        return false;
      }

      console.log("Results uploaded successfully:", upload);
      return parseStringify(upload);
    }
  } catch (error) {
    console.error("Error in uploading results:", error);
    return false;
  }
};

