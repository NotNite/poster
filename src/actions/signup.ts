"use server";

import prisma from "@/prisma";
import { UserSchema } from "@/schema";
import * as bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function signup(form: FormData) {
  let formData;
  try {
    formData = UserSchema.parse(Object.fromEntries(form.entries()));
  } catch (e) {
    return "validation failed";
  }

  const hash = await bcrypt.hash(formData.password, 10);

  let user;
  try {
    user = await prisma.user.create({
      data: {
        username: formData.username,
        passwordHash: hash,
        authToken: uuid()
      }
    });
  } catch (e) {
    return "username taken";
  }

  // @ts-ignore
  cookies().set("token", user.authToken);

  redirect("/posts");
}
