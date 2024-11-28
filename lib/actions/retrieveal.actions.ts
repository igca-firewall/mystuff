"use server";
// import { ID,  ImageGravity, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
// import { InputFile } from "node-appwrite/file";
import { parseStringify } from "@/lib/utils";
const {
  //     APPWRITE_POST_COLLECTION_ID: POST_COLLECTION_ID,
  //     APPWRITE_STORAGE_ID: STORAGE_ID,
  APPWRITE_DATABASE_ID: DATABASE_ID,
  //     NEXT_PUBLIC_APPWRITE_ENDPOINT: ENDPOINT,
  //     NEXT_PUBLIC_APPWRITE_PROJECT: PROJECT_ID,
  //     APPWRITE_STUDENTS_COLLECTION_ID: APPWRITE_STUDENTS_COLLECTION_ID,
  APPWRITE_RESULT_COLLECTION_ID: RESULTS_ID,
  //     APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTIONS_ID,
  //     APPWRITE_CLASS_COLLECTION_ID: CLASSES,
  //     APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  //     APPWRITE_SCRATCHCARD_COLLECTION_ID: SCRATCHCARD_COLLECION_ID,
} = process.env;

export async function getStudentResultById(id: string) {
  try {
    const { database } = await createAdminClient();
    const result = await database.getDocument(DATABASE_ID!, RESULTS_ID!, id);

    return parseStringify(result);
  } catch (error) {
    console.log(error);
  }
}
export async function updateStudentResult({
  id,
  results,
  stat,
}: updateResultProps) {
  try {
    const { database } = await createAdminClient();
    const result = await database.updateDocument(
      DATABASE_ID!,
      RESULTS_ID!,
      id,

      {
        ...results,
        stat,
      }
    );

    return parseStringify(result);
  } catch (error) {
    console.log(error);
  }
}
