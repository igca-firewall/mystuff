"use server";
import { ID } from "node-appwrite";
import {
  generateUniqueId,
  parseStringify,
  generateScratchCardCode,
} from "../utils";
import { createAdminClient } from "../appwrite";
const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  // APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  //   APPWRITE_STUDENTS_COLLECTION_ID: APPWRITE_STUDENTS_COLLECTION_ID,
  //   APPWRITE_RESULT_COLLECTION_ID: RESULTS_ID,
  //   APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTIONS_ID,
  APPWRITE_SCRATCHCARD_COLLECTION_ID: SCRATCHCARD_COLLECION_ID,
} = process.env;

export const createScratchCard = async () => {
  const { database } = await createAdminClient();
  try {
    const newUser = await database.createDocument(
      DATABASE_ID!,
      SCRATCHCARD_COLLECION_ID!,
      ID.unique(),
      {
        code: generateScratchCardCode(),
        id: generateUniqueId(),
        status: "unUsed",
      }
    );
    if (!newUser) {
      console.log("No new ScratchCard created");
    }
    return parseStringify(newUser);
  } catch (error) {
    console.error("An error occurred while creating a scratch card:", error);
  }
};
export const updateScratchCardStatusCode = async ({ id }: ScratchCard) => {
  try {
    const { database } = await createAdminClient();
    const updateScratchCard = await database.updateDocument(
      DATABASE_ID!,
      SCRATCHCARD_COLLECION_ID!,
      id,
      {
        status: "used",
      }
    );

    if (!updateScratchCard) {
      throw new Error("Failed to update Scratch Card Status.");
    }

   return parseStringify(updateScratchCard);
  } catch (error) {
    console.log("Error Updating the Scratch Card Status:", error);
  }
};
export const deleteScratchCard = async ({ id }: ScratchCard) => {
  try {
    const { database } = await createAdminClient();
    const deleteScratchCard = await database.deleteDocument(
      DATABASE_ID!,
      SCRATCHCARD_COLLECION_ID!,
      id
    );

    if (!deleteScratchCard) {
      throw new Error("Failed to delete Scratch Card😭.");
    }
  } catch (error) {
    console.log("Error Deleting the Scratch Card😭:", error);
  }
};
