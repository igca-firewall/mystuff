"use server";
import { ID, } from "node-appwrite";
import { createAdminClient } from "../appwrite";


const {
  APPWRITE_POST_COLLECTION_ID: POST_COLLECTION_ID,
  // APPWRITE_STORAGE_ID: STORAGE_ID,
  APPWRITE_DATABASE_ID: DATABASE_ID,
  // NEXT_PUBLIC_APPWRITE_ENDPOINT: ENDPOINT,
  // NEXT_PUBLIC_APPWRITE_PROJECT: PROJECT_ID,
  // APPWRITE_STUDENTS_COLLECTION_ID: APPWRITE_STUDENTS_COLLECTION_ID,
  // APPWRITE_RESULT_COLLECTION_ID: RESULTS_ID,
  // APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTIONS_ID,
  // APPWRITE_CLASS_COLLECTION_ID: CLASSES,
  // APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  // APPWRITE_SCRATCHCARD_COLLECTION_ID: SCRATCHCARD_COLLECION_ID,
} = process.env;

export const createPost = async ({  ...post }: INewPost) => {
    try {
      const { database } = await createAdminClient();
    //   let fileA;
    //   // let fileUrl;
  
    //   if (file) {
    //     const inputFile = InputFile.fromBuffer(
    //       file.get("blobFile") as Blob,
    //       file.get("fileName") as string
    //     );
    //     fileA = await storage.createFile(STORAGE_ID!, ID.unique(), inputFile);
  
    //     if (!fileA) {
    //       throw new Error("File upload failed.");
    //     }
    //  }
  
      const newPost = await database.createDocument(
        DATABASE_ID!,
        POST_COLLECTION_ID!,
        ID.unique(),
        { 
          ...post,
        //   imageId: fileA?.$id || null,
        //   imageUrl: fileA?.$id
        //     ? `${ENDPOINT}/storage/buckets/${STORAGE_ID!}/files/${fileA.$id}/view?project=${PROJECT_ID}`
        //     : null,
        }
      );
  
    //   if (!newPost) {
    //     if (fileA?.$id) {
    //       await storage.deleteFile(STORAGE_ID!, fileA.$id);
    //     }
    //     throw new Error("Failed to create a new post.");
    //   }
  
      return newPost;
    } catch (error) {
      console.error("An error occurred while creating a new post:", error);
      throw error;
    }
  };

  