"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";

const {
  //     APPWRITE_POST_COLLECTION_ID: POST_COLLECTION_ID,
  //     APPWRITE_STORAGE_ID: STORAGE_ID,
  APPWRITE_COMPILED_ID: COMPILED_RESULTS_ID,
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_2ND_TERM_COLLECTION_ID: SECOND,
  APPWRITE_3RD_TERM_COLLECTION_ID: THIRD,
  APPWRITE_1ST_TERM_COLLECTION_ID: FIRST,

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
export const addresults = async ({
  classRoom,
  session,
  term,
  subject,
  scores,
}: {
  classRoom: string;
  session: string;
  term: string;
  subject: string;
  scores: string[];
}) => {
  try {
    const { database } = await createAdminClient();
    const index = `${session}_${term}_${classRoom}_${subject}`;
    const hem =
      term === "1st Term" ? FIRST : term === "2nd Term" ? SECOND : THIRD;
    const existingResults = await database.listDocuments(DATABASE_ID!, hem!, [
      Query.equal("index", index),
    ]);
    if (existingResults) {
      const updatedExistingResults = await database.updateDocument(
        DATABASE_ID!,
        hem!,
        existingResults.documents[0].$id,
        {
          scores: scores,
        }
      );
      console.log(
        "Updated Successfully the existing results",
        updatedExistingResults
      );
      return parseStringify(updatedExistingResults);
    }

    const resultCollection = await database.createDocument(
      DATABASE_ID!,
      hem!,
      ID.unique(),
      {
        index: index,
        classRoom,
        session,
        term,
        subject,
        scores,
      }
    );

    console.log("Result created successfully", resultCollection);
    return parseStringify(resultCollection);
  } catch (error) {
    console.log("Error uploading results array results", error);
  }
};
export const fetchResultData = async ({
  classRoom,
  session,
  term,
  subject,
}: {
  classRoom: string;
  session: string;
  term: string;
  subject: string;
}) => {
  const { database } = await createAdminClient();
  const hem =
    term === "1st Term" ? FIRST : term === "2nd Term" ? SECOND : THIRD;
  const index = `${session}_${term}_${classRoom}_${subject}`;
  const fetchedResults = await database.listDocuments(DATABASE_ID!, hem!, [
    Query.equal("index", index),
  ]);
  if (fetchedResults) {
    console.log("Rerieved the result data", fetchedResults);
    return parseStringify(fetchedResults);
  }
  console.log("Nothing like such", fetchedResults);
  return null;
};
export const deleteClassResult = async ({
  classRoom,
  session,
  term,
  subject,
  scores,
}: {
  classRoom: string;
  session: string;
  term: string;
  subject: string;
  scores: string[];
}) => {
  const { database } = await createAdminClient();
  const hem =
    term === "1st Term" ? FIRST : term === "2nd Term" ? SECOND : THIRD;
  const index = `${session}_${term}_${classRoom}_${subject}`;
  const dataToDelete = await fetchResultData({
    classRoom,
    session,
    term,
    subject,
  });
  if (dataToDelete) {
    await database.deleteDocument(
      DATABASE_ID!,
      hem!,
      dataToDelete.documents[0].$id
    );
  }
};
