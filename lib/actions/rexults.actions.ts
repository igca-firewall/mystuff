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

export const fetchResult = async ({
  classRoom,
  id,
  term,
  session,
}: ResultParams) => {
  const { database } = await createAdminClient();

  // Prepare query filters for the `RESULTS_ID` collection
  const resultQueries = [];
  if (id) resultQueries.push(Query.equal("studentId", id));

  if (classRoom) resultQueries.push(Query.equal("classRoom", classRoom));
  if (term) resultQueries.push(Query.equal("term", term));

  try {
    // Fetch results from the `RESULTS_ID` collection
    const resultData = await database.listDocuments(
      DATABASE_ID!,
      RESULTS_ID!,
      resultQueries
    );

    if (
      !resultData ||
      !resultData.documents ||
      resultData.documents.length === 0
    ) {
      console.log("No results found:", resultData);
      return false;
    }

    console.log(
      "Results metadata retrieved successfully:",
      resultData.documents
    );

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

    console.log(
      "Combined results with scores retrieved successfully 😁😁😁",
      combinedResults
    );
    return parseStringify(combinedResults);
  } catch (error) {
    console.error("Error fetching results and scores:", error);
    return false;
  }
};
export const fetchResultWithSubject = async ({
  classRoom,
id,
  term,
  subject,
  session,
}: ResultParams & { subject?: string }) => {
  const { database } = await createAdminClient();

  // Prepare query filters for the `RESULTS_ID` collection
  const resultQueries = [];
  if (session) resultQueries.push(Query.equal("session", session));
  if (classRoom) resultQueries.push(Query.equal("classRoom", classRoom));
  if (term) resultQueries.push(Query.equal("term", term));

  try {
    // Fetch results from the `RESULTS_ID` collection
    const resultData = await database.listDocuments(
      DATABASE_ID!,
      RESULTS_ID!,
      resultQueries
    );

    if (
      !resultData ||
      !resultData.documents ||
      resultData.documents.length === 0
    ) {
      console.log("No results found:", resultData);
      return false;
    }

    console.log(
      "Results metadata retrieved successfully:",
      resultData.documents
    );
    const scoresQuery = [];
    if (session) scoresQuery.push(Query.equal("session", session));
    if (subject) scoresQuery.push(Query.equal("subject", subject));
    if (term) scoresQuery.push(Query.equal("term", term));
    if (id) scoresQuery.push(Query.equal("studentId", id));

    // Fetch scores for the selected subject in each result document
    const combinedResults = await database.listDocuments(
      DATABASE_ID!,
      SCORES_ID!,
      scoresQuery
    );
    // const combinedResults = await Promise.all(
    //   resultData.documents.map(async (resultDoc) => {
    //     const scoresArray = resultDoc.scores; // Assumes `scores` is an array of IDs
    //     const scoresDetails = await Promise.all(
    //       scoresArray.map(async (scoreId: string) => {
    //         const scoreDoc = await database.getDocument(
    //           DATABASE_ID!,
    //           SCORES_ID!,
    //           scoreId
    //         );

    //         // Filter by subject if subject is provided
    //         if (subject && scoreDoc.subject !== subject) {
    //           return null; // Exclude non-matching scores
    //         }
    //         return scoreDoc;
    //       })
    //     );

    //     return {
    //       ...resultDoc,
    //       scoresDetails: scoresDetails.filter(Boolean), // Remove null values
    //     };
    //   })
    // );

    console.log(
      "Combined results with scores retrieved successfully 😁😁😁",
      combinedResults
    );
    return parseStringify(combinedResults.documents);
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
  session,
  project,
  bnb,
  assignment,
  exam,
  result,
}: {
  id: string;
  classRoom: string;
  session: string;
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
  try {
    const { database } = await createAdminClient();
    console.log(
      "Information",
      id,
      classRoom,
      term,
      grade,
      createdBy,
      subject,
      total,
      firstTest,
      secondTest,
      session,
      project,
      bnb,
      assignment,
      exam,
      result
    );
    if (!DATABASE_ID || !SCORES_ID || !RESULTS_ID) {
      throw new Error("Database or collection IDs are not defined.");
    }

    const scoreId = ID.unique();

    // Step 1: Check if the score document exists
    const existingScores = await database.listDocuments(
      DATABASE_ID,
      SCORES_ID,
      [
        Query.equal("session", session),
        Query.equal("subject", subject),
        Query.equal("term", term),
        Query.equal("studentId", id),
      ]
    );

    console.log("Existing scores:", existingScores);

    let finalScoreId = scoreId;

    if (existingScores.total > 0) {
      // Update existing score document
      const scoreDoc = existingScores.documents[0];
      finalScoreId = scoreDoc.$id;

      const updatedScore = await database.updateDocument(
        DATABASE_ID,
        SCORES_ID,
        scoreDoc.$id,
        {
          firstTest,
          secondTest,
          project,
          assignment,
          bnb,
          subject,
          total,
          grade,
          exam,
        }
      );
      if (!updatedScore) {
        console.error("Failed to update the score document:", scoreDoc.$id);
        return null;
      }
      console.log(`Updated scores for subject: ${subject}`);
    } else {
      // Create a new score document
      const createdScore = await database.createDocument(
        DATABASE_ID,
        SCORES_ID,
        scoreId,
        {
          firstTest,
          secondTest,
          project,
          bnb,
          assignment,
          subject,
          studentId: id,
          total,
          term,
          session,
          grade,
          exam,
          result: scoreId,
        }
      );
      if (!createdScore) {
        console.error("Failed to create a score document for:", subject);
        return null;
      }
      console.log(`Created new score document for subject: ${subject}`);
    }

    // Step 2: Check if the result document exists
    const existingResults = await database.listDocuments(
      DATABASE_ID,
      RESULTS_ID,
      [
        Query.equal("studentId", id),
        Query.equal("classRoom", classRoom),
        Query.equal("term", term),
      ]
    );

    console.log("Existing results:", existingResults);

    if (existingResults.total > 0) {
      // Update existing results document
      const resultDoc = existingResults.documents[0];
      const updatedScoresArray = Array.from(
        new Set([...(resultDoc.scores || []), finalScoreId])
      );

      const updatedResult = await database.updateDocument(
        DATABASE_ID,
        RESULTS_ID,
        resultDoc.$id,
        { scores: updatedScoresArray }
      );

      if (!updatedResult) {
        console.error("Failed to update the result document:", resultDoc.$id);
        return null;
      }

      console.log("Updated results document:", updatedResult);
      return parseStringify(updatedResult);
    } else {
      // Create a new results document
      const newResult = await database.createDocument(
        DATABASE_ID,
        RESULTS_ID,
        ID.unique(),
        {
          studentId: id,
          scores: [finalScoreId],
          classRoom,
          session,
          term,
          createdBy,
        }
      );

      if (!newResult) {
        console.error("Failed to create a results document for:", id);
        return null;
      }

      console.log("Created new results document:", newResult);
      return parseStringify(newResult);
    }
  } catch (error) {
    console.error("Error uploading results:", error);
    return false;
  }
};
