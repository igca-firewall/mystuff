"use server";
import { ID, ImageGravity } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { nanoid } from "nanoid";
import { InputFile } from "node-appwrite/file";

const {
  APPWRITE_STORAGE_ID_USER: STORAGE_ID_USER,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_USERMORE_COLLECTION_ID: USERMORE,
  APPWRITE_POST_COLLECTION_ID: POST_COLLECTION_ID,
  APPWRITE_DATABASE_ID: DATABASE_ID,
  NEXT_PUBLIC_APPWRITE_ENDPOINT: ENDPOINT,
  NEXT_PUBLIC_APPWRITE_PROJECT: PROJECT_ID,
  APPWRITE_STORAGE_ID: STORAGE_ID,
} = process.env;

export async function deleteFile(fileId: string) {
  try {
    const { storage } = await createAdminClient();
    await storage.deleteFile(STORAGE_ID_USER!, fileId);
    return { status: "ok" };
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}

export async function getFilePreview(fileId: string) {
  try {
    const { storage } = await createAdminClient();
    const fileUrl = storage.getFilePreview(
      STORAGE_ID_USER!,
      fileId,
      2000,
      2000,
      ImageGravity.Top,
      100
    );
    return fileUrl;
  } catch (error) {
    console.error("Error getting file preview:", error);
  }
}

export const updateUserAvatar = async ({ user, file }: Helper) => {
  try {
    const { database, storage } = await createAdminClient();
    let fileA;
    // let fileUrl;

    if (file) {
      const inputFile = file.get("blobFile") as File;
      const fileName = file.get("fileName") as string;

      // Convert FormData to InputFile
      const appwriteFile = InputFile.fromBuffer(inputFile, fileName);

      fileA = await storage.createFile(
        STORAGE_ID_USER!,
        ID.unique(),
        appwriteFile
      );

      // if (fileA.$id) {
      //   fileUrl = await getFilePreview(fileA.$id);

      // }
    }

    const updatedUser = await database.updateDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      user.$id,
      {
        imageId: fileA?.$id ?? null,
        imageUrl: fileA?.$id
          ? `${ENDPOINT}/storage/buckets/${STORAGE_ID_USER!}/files/${
              fileA.$id
            }/view?project=${PROJECT_ID}`
          : null,
      }
    );

    if (!updatedUser && fileA?.$id) {
      await deleteFile(fileA.$id);
      throw new Error("Failed to update user document.");
    }

    return parseStringify(updatedUser);
  } catch (error) {
    console.error("An error occurred while updating the user avatar:", error);
  }
};
export const updatePost = async ({ file, postId, ...post }: IUpdatePost) => {
  try {
    const { database, storage } = await createAdminClient();
    let fileA;

    if (file) {
      const inputFile = InputFile.fromBuffer(
        file.get("blobFile") as Blob,
        file.get("fileName") as string
      );

      // Upload the file to storage
      fileA = await storage.createFile(STORAGE_ID!, nanoid(), inputFile);

      if (!fileA || !fileA.$id) {
        throw new Error("File upload failed.");
      }
    }

    // Update the post document in the database
    const updatedPost = await database.updateDocument(
      DATABASE_ID!,
      POST_COLLECTION_ID!,
      postId,
      {
        ...post,
        imageId: fileA?.$id ?? null,
        imageUrl: fileA?.$id
          ? `${ENDPOINT}/storage/buckets/${STORAGE_ID!}/files/${
              fileA.$id
            }/view?project=${PROJECT_ID}`
          : null,
      }
    );

    if (!updatedPost) {
      if (fileA?.$id) {
        // Remove the file if the post update failed
        await storage.deleteFile(STORAGE_ID!, fileA.$id);
      }
      throw new Error("Failed to update the post.");
    }

    return updatedPost;
  } catch (error) {
    console.error("An error occurred while updating the post:", error);
    // Re-throw the error to be handled by the calling function
    throw error;
  }
};

export const updateUserProfile = async ({
  userId,
  firstName,
  lastName,
  email,
  phone,
}: UpdateUserProfileParams) => {
  try {
    const { database } = await createAdminClient();

    // Prepare the user update payload
    const userUpdatePayload = {
      firstName: firstName ?? null,
      lastName: lastName ?? null,

      email: email ?? null,
      phone: phone ?? null,
    };

    // Update the user document in the database
    const updatedUser = await database.updateDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      userId,
      userUpdatePayload
    );

    if (!updatedUser) {
      throw new Error("Failed to update user document.");
    }

    return parseStringify(updatedUser);
  } catch (error) {
    console.error("An error occurred while updating the user profile:", error);
    throw error;
  }
};
export const updateUserMoreProfile = async ({
  userId,

  bio,
  Links,
}: UpdateUserProfileParams) => {
  try {
    const { database } = await createAdminClient();

    // Prepare the user update payload
    const userUpdatePayload = {
      bio: bio ?? null,
      Links: Links ?? null,
    };

    // Update the user document in the database
    const updatedUser = await database.updateDocument(
      DATABASE_ID!,
      USERMORE!,
      userId,
      userUpdatePayload
    );

    if (!updatedUser) {
      throw new Error("Failed to update user document.");
    }

    return parseStringify(updatedUser);
  } catch (error) {
    console.error("An error occurred while updating the user profile:", error);
    throw error;
  }
};
