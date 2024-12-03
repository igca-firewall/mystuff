"use server"
import { cookies } from "next/headers";
import { createAdminClient } from "../appwrite";
import { getUserInfo } from "./user.actions";
import { parseStringify } from "../utils";
import {  Query } from "node-appwrite";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,

  APPWRITE_ADMIN_COLLECTION_ID: ADMIN_COLLECTION_ID,
} = process.env;

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    // Set cookie for server-side session management
    (await cookies()).set("PARTICLES", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getUserInfo({ userId: session?.userId });

    // Store evidence of login in local storage

    return parseStringify(user);
  } catch (error) {
    console.error("Error", error);
  }
};
export const adminSignIn = async ({
  password,
  
  adminContact,
  name,
  adminId,
  adminCode,
  email,
}: AdminProps) => {
  //   let newAdminAccount;

  try {
    const { account, database } = await createAdminClient();
    const namees = name;
    // Check if the user is in the students collection
    const  adminQuery = await database.listDocuments(
      DATABASE_ID!,
      ADMIN_COLLECTION_ID!, // Replace with the actual collection ID of the "students" collection
      [
        Query.equal("name", namees),
        Query.equal("adminCode", adminCode),
        Query.equal("adminContact", adminContact),
        Query.equal("adminId", adminId),
        Query.equal("email", email),

        // Use the phone or any other field for filtering
        // You can add more fields to match if necessary
        // Query.equal("email", email) // You can add more fields to match if necessary
      ]
    );

    if (
       adminQuery.total === 0 
       
    ) {
      // If no student found, return a message saying "You are not a student"
      console.log("No Admin Like Such",  adminQuery, name);
      return { error: "You are not an Admin" };
    }
    console.log("Admin found ",  adminQuery);

    // Create the user account since the user exists in the "students" collection
    // newAdminAccount = await users.create(
    //   ID.unique(),
    //   email,
    //   adminContact,
    //   password,
    //   namees
    // );

    // if (!newAdminAccount) throw new Error("Error creating user");

    // const newAdmin = await database.createDocument(
    //   DATABASE_ID!,
    //   USER_COLLECTION_ID!,
    //   ID.unique(),
    //   {
    //     phone,
    //     image,
    //     name: namees,
    //     userId: newAdminAccount.$id,
    //     ...userData,
    //   }
    // );

    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("PARTICLES_admin", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    const user = await getUserInfo({ userId: session?.userId });

    return parseStringify(user);
  } catch (error) {
    console.error("Error during sign-up process:", error);
  }
};
