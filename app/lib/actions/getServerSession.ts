"use server";

import { auth } from "../auth";

export async function getServerSession() {
  const session = await auth();
  if (!session) {
    return null;
  }
  return session;
}
