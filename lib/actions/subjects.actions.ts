"use server";
import { ID } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
// import { nanoid } from "nanoid";
// import { InputFile } from "node-appwrite/file";

const {
  //     APPWRITE_POST_COLLECTION_ID: POST_COLLECTION_ID,
  //     APPWRITE_STORAGE_ID: STORAGE_ID,
  APPWRITE_DATABASE_ID: DATABASE_ID,
  //     NEXT_PUBLIC_APPWRITE_ENDPOINT: ENDPOINT,
  //     NEXT_PUBLIC_APPWRITE_PROJECT: PROJECT_ID,
  //     APPWRITE_STUDENTS_COLLECTION_ID: APPWRITE_STUDENTS_COLLECTION_ID,
  //     APPWRITE_RESULT_COLLECTION_ID: RESULTS_ID,
  //     APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  //     APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTIONS_ID,
  //     APPWRITE_CLASS_COLLECTION_ID: CLASSES,
  //     APPWRITE_SCRATCHCARD_COLLECTION_ID: SCRATCHCARD_COLLECION_ID,
  APPWRITE_SUBJECT_COLLECTION_ID: SUBJECTS_ID,
} = process.env;

export const createSubject = async ({ name, classRoom }: subjectProps) => {
  try {
    const { database } = await createAdminClient();
    const newSubject = await database.createDocument(
      DATABASE_ID!,
      SUBJECTS_ID!,
      ID.unique(),
      {
        name,
        ...classRoom,
      }
    );
    console.log("New Subject Created!✔✔")
    return parseStringify(newSubject);
  } catch (error) {
    console.log("Error creating Subject in the database: ", error);
  }
};
export const deleteScratchCard = async ({ id }: ScratchCard) => {
    try {
      const { database } = await createAdminClient();
      const deleteScratchCard = await database.deleteDocument(
        DATABASE_ID!,
        SUBJECTS_ID!,
        id
      );
  
      if (!deleteScratchCard) {
        throw new Error("Failed to delete Subject😭.");
      }
    } catch (error) {
      console.log("Error Deleting the Subject😭:", error);
    }
  };