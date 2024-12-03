"use server";
import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { parseStringify } from "../utils";

import { cookies } from "next/headers";
const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_STUDENTS_COLLECTION_ID: STUDENTS_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );
    if (!user) {
      throw Error;
    }
    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

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

export const signUp = async ({
  password,
  image,
  phone,name,
  ...userData
}: SignUpParams) => {
  const { email,  } = userData;

  let newUserAccount;

  try {
    const { account, users, database } = await createAdminClient();
    const namees = name;
    // Check if the user is in the students collection
    const studentQuery = await database.listDocuments(
      DATABASE_ID!,
      STUDENTS_COLLECTION_ID!, // Replace with the actual collection ID of the "students" collection
      [
        Query.equal("name", namees), // Use the phone or any other field for filtering
        // You can add more fields to match if necessary
        // Query.equal("email", email) // You can add more fields to match if necessary
      ]
    );

    if (
      studentQuery.total === 0 ||
      studentQuery.documents[0].status === "created"
    ) {
      // If no student found, return a message saying "You are not a student"
      console.log("No Student Like Such", studentQuery, name);
      return { error: "You are not a student" };
    }
    console.log("Student found🤍❤❤💛💛", studentQuery);

    // Create the user account since the user exists in the "students" collection
    newUserAccount = await users.create(
      ID.unique(),
      email,
      phone,
      password,
      namees
    );

    if (!newUserAccount) throw new Error("Error creating user");

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        phone,
        image,
        name: namees,
        userId: newUserAccount.$id,
        ...userData,
      }
    );

    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("PARTICLES", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    if (studentQuery.total !== 0 && newUser) {
      const updatedStudent = await database.updateDocument(
        DATABASE_ID!,
        STUDENTS_COLLECTION_ID!,
        studentQuery.documents[0].$id,
        {
          status: "created",
        }
      );
    }
    return parseStringify(newUser);
  } catch (error) {
    console.error("Error during sign-up process:", error);
  }
};

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();
    (await cookies()).delete("PARTICLES");
    (await cookies()).delete("PARTICLES_admin");
    await account.deleteSession("current");
  } catch (error) {
    console.log(error);
    return null;
  }
};
export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();
    if (!result) {
      throw Error;
    }
    const xed = await getUserInfo({ userId: result.$id });

    return parseStringify(xed);
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function getUserById(userId: string) {
  try {
    const { database } = await createAdminClient();
    const user = await database.getDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      userId
    );

    return user;
  } catch (error) {
    console.log(error);
  }
}
