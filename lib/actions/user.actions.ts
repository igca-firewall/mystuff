"use server";
import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { parseStringify } from "../utils";

import { cookies } from "next/headers";
const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
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
  phone,
  ...userData
}: SignUpParams) => {
  const { email, firstName, lastName } = userData;

  let newUserAccount;

  try {
    const { account, users, database } = await createAdminClient();

    // Create the user
    newUserAccount = await users.create(
      ID.unique(),
      email,
      phone,
      password,
      `${firstName} ${lastName}`
    );

    if (!newUserAccount) throw new Error("Error creating user");

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        phone,
        image,
        name: `${firstName} ${lastName}`,
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

    return parseStringify(newUser);
  } catch (error) {
    console.error("Error during sign-up process:", error);
  }
};
export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();
    (await cookies()).delete("PARTICLES");
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
