"use server";

import { deleteUser, getUser } from "@/utils";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function deleteAccount() {
  const user = await getUser();
  if (user === null) return;

  await deleteUser(user.id);
  // @ts-ignore
  cookies().delete("token");
  redirect("/");
}
