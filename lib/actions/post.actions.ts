"use server";
import { ID,  ImageGravity, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";

const {
  APPWRITE_POST_COLLECTION_ID: POST_COLLECTION_ID,
  APPWRITE_STORAGE_ID: STORAGE_ID,
  APPWRITE_SAVES_COLLECTION_ID: SAVES_COLLECTION_ID,
  APPWRITE_DATABASE_ID: DATABASE_ID,
  NEXT_PUBLIC_APPWRITE_ENDPOINT: ENDPOINT,
  NEXT_PUBLIC_APPWRITE_PROJECT: PROJECT_ID,
  APPWRITE_USERMORE_COLLECTION_ID: USERMORE,

} = process.env;
// export const generateSecureFileLink = (fileId: string) => {
//   const expiryTime = Math.floor(Date.now() / 1000) + 15 * 60; // 15 minutes from now
//   const signature = createSignature(fileId, expiryTime);
//   return `${ENDPOINT}/storage/buckets/${STORAGE_ID}/files/${fileId}/view?project=${PROJECT_ID}&expires=${expiryTime}&signature=${signature}`;
// };
// export const createSignature = (fileId: string, expiryTime: number) => {
//   return crypto
//     .createHmac("sha256", SECRET_KEY!)
//     .update(`${fileId}${expiryTime}`)
//     .digest("hex");
// };
export const createPost = async ({ file, ...post }: INewPost) => {
  try {
    const { database, storage } = await createAdminClient();
    let fileA;
    // let fileUrl;

    if (file) {
      const inputFile = InputFile.fromBuffer(
        file.get("blobFile") as Blob,
        file.get("fileName") as string
      );
      fileA = await storage.createFile(STORAGE_ID!, ID.unique(), inputFile);

      if (!fileA) {
        throw new Error("File upload failed.");
      }
   }

    const newPost = await database.createDocument(
      DATABASE_ID!,
      POST_COLLECTION_ID!,
      ID.unique(),
      { 
        ...post,
        imageId: fileA?.$id || null,
        imageUrl: fileA?.$id
          ? `${ENDPOINT}/storage/buckets/${STORAGE_ID!}/files/${fileA.$id}/view?project=${PROJECT_ID}`
          : null,
      }
    );

    if (!newPost) {
      if (fileA?.$id) {
        await storage.deleteFile(STORAGE_ID!, fileA.$id);
      }
      throw new Error("Failed to create a new post.");
    }

    return newPost;
  } catch (error) {
    console.error("An error occurred while creating a new post:", error);
    throw error;
  }
};
export async function uploadFile(file: File) {
  try {
    const { storage } = await createAdminClient();
    const uploadedFile = await storage.createFile(
      STORAGE_ID!,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
export async function getFilePreview(fileId: string) {
  try {
    const { storage } = await createAdminClient();
    const fileUrl = storage.getFilePreview(
      STORAGE_ID!,
      fileId,
      2000,
      2000,
      ImageGravity.Top,
      100
    );
    return fileUrl;
  } catch (error) {
    console.error("Error getting file preview:", error);
    throw error;
  }
}
export async function deleteFile(fileId: string) {
  try {
    const { storage } = await createAdminClient();
    await storage.deleteFile(STORAGE_ID!, fileId);
    return { status: "ok" };
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}
export async function getPost(postId: string) {
  try {
    const { database } = await createAdminClient();
    const post = await database.getDocument(
      DATABASE_ID!,
      POST_COLLECTION_ID!,
      postId
    );
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
}
export async function getAllPosts() {
  try {
    const { database } = await createAdminClient();
    const posts = await database.listDocuments(
      DATABASE_ID!,
      POST_COLLECTION_ID!,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );
    if (!posts) throw new Error("No posts found");
    return posts.documents;
  } catch (error) {
    console.error("Error fetching all posts:", error);
    throw error;
  }
}
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const { database } = await createAdminClient();
    const updatedPost = await database.updateDocument(
      DATABASE_ID!,
      POST_COLLECTION_ID!,
      postId,
      { likes: likesArray }
    );
    if (!updatedPost) throw new Error("Failed to like the post.");
    return updatedPost;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
}
export async function savePost(postId: string, userId: string) {
  try {
    const { database } = await createAdminClient();
    const savedPost = await database.createDocument(
      DATABASE_ID!,
      SAVES_COLLECTION_ID!,
      ID.unique(),
      { user: userId, post: postId }
    );
    if (!savedPost) throw new Error("Failed to save the post.");
    return savedPost;
  } catch (error) {
    console.error("Error saving post:", error);
    throw error;
  }
}
export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId)
    throw new Error("Post ID and Image ID are required.");
  try {
    const { database } = await createAdminClient();
    await database.deleteDocument(DATABASE_ID!, POST_COLLECTION_ID!, postId);
    await deleteFile(imageId);
    return { status: "ok" };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}
export async function getRecentPosts() {
  const { database } = await createAdminClient();
  const posts = await database.listDocuments(
    DATABASE_ID!,
    POST_COLLECTION_ID!,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );
  if (!posts) throw Error;
  return posts;
}

export async function getPostById(postId: string) {
  try {
    const { database } = await createAdminClient();
    const post = await database.getDocument(
      DATABASE_ID!,
      POST_COLLECTION_ID!,
      postId
    );
    
    return post;
  } catch (error) {
    console.log(error);
  }
}
export async function getPostsForUser(userId: string) {
  const { database } = await createAdminClient();

  const posts = await database.listDocuments(
    DATABASE_ID!,
    POST_COLLECTION_ID!,

    [Query.orderDesc("$createdAt"), Query.equal("creator", userId)]
  );
  if (!posts) throw Error;
  return posts.documents;
}
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const { database } = await createAdminClient();
    const statusCode = await database.deleteDocument(
      DATABASE_ID!,
      SAVES_COLLECTION_ID!,
      savedRecordId
    );
    if (!statusCode) throw Error;
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}
export async function getSavesForUser(userId: string) {
    const saves = await getPostsForSaver(userId);
    console.log("Saved items👩👩",saves)
    if (!saves) throw Error;
   
    return saves;
    };
// export async function updatePost(post: IUpdatePost) {
//   const hasFileToUpdate = post?.file?.length > 0;
//   try {
//     let image = {
//       imageUrl: post.imageUrl,
//       imageId: post.imageId,
//     };
//     if (hasFileToUpdate) {
//       const uploadedFile = await uploadFile(post.file[0]);
//       if (!uploadedFile) throw Error;
//       const fileUrl = getFilePreview(uploadedFile.$id);
//       if (!fileUrl) {
//         deleteFile(uploadedFile.$id);
//         throw Error;
//       }
//       image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
//     }
//     //convert tags
//     const tags = post.tags?.replace(/ /g, "").split(",") || [];
//     const updatedPost = await databases.updateDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.postCollectionId,
//       post.postId,
//       {
//         caption: post.caption,

//         imageUrl: image.imageUrl,
//         tags: tags,
//         imageId: image.imageId,
//         location: post.location,
//       }
//     );
//     if (!updatedPost) {
//       await deleteFile(post.imageId);
//       throw Error;
//     }
//     return updatedPost;
//   } catch (error) {
//     console.log(error);
//   }
// }

export async function getPostsForSaver(userId: string) {
  const { database } = await createAdminClient();

  const posts = await database.listDocuments(
    DATABASE_ID!,
    SAVES_COLLECTION_ID!,

    [Query.orderDesc("$createdAt"), Query.equal("user", userId)]
  );
  if (!posts) throw Error;
  return posts.documents;
}


export async function followUser(user: string, followers?: string[]) {
  try {
    const { database } = await createAdminClient();

    // Update the followed user's document (adding the current user to the followers list)
    const updatedDocument = await database.updateDocument(
      DATABASE_ID!,
      USERMORE!,  // Collection ID where user documents are stored
      user,     // The document ID of the user being followed
      { followers } // The updated list of followers
    );

    if (!updatedDocument) throw new Error("Failed to update the document.");
    console.log("Updated document:", updatedDocument)
    return updatedDocument;

  } catch (error) {
    console.log("Error updating document:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

export async function unfollowUser(userId: string, followers: string[]) {
  try {
    const { database } = await createAdminClient();

    // Update the unfollowed user's document (removing the current user from the followers list)
    const updatedDocument = await database.updateDocument(
      DATABASE_ID!,
      USERMORE!,  // Collection ID where user documents are stored
      userId,     // The document ID of the user being unfollowed
      { followers } // The updated list of followers
    );

    if (!updatedDocument) throw new Error("Failed to update the document.");

    return updatedDocument;
  } catch (error) {
    console.log("Error updating document:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}
