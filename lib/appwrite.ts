"use server";

import { Client, Account, Databases, Users, Storage, Messaging, Avatars } from "node-appwrite";
import { cookies } from "next/headers";

interface AdminClient {
  account: Account;
  database: Databases;
  users: Users;
  storage: Storage;
  messaging: Messaging;
  avatars: Avatars;
}

export async function createSessionClient(): Promise<{ account: Account, }> {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = (await cookies()).get("PARTICLES");
  
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    account: new Account(client),
 
  };
}

export async function createAdminClient(): Promise<AdminClient> {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    account: new Account(client),
    database: new Databases(client),
    users: new Users(client),
    
    storage: new Storage(client),
    messaging: new Messaging(client),
    avatars: new Avatars(client),
  };
} 
// const permissions = [
//   Permission.read(Role.any()),  
//   Permission.create(Role.user("user")),
//   // Anyone can view this document
//   Permission.update(Role.team("writers")),       // Writers can update this document
//   Permission.update(Role.team("admin")),         // Admins can update this document
//   Permission.delete(Role.user("user")),          // Specific user can delete this document
//   Permission.delete(Role.team("admin")),         // Admins can delete this document
//   Permission.read(Role.user("user")),           // Admins can read user data
// ];
