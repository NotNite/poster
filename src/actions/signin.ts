"use server";

import { UserSchema } from "@/schema";
import { redirect } from "next/navigation";
import prisma from "@/prisma";
import { v4 as uuid } from "uuid";
import * as bcrypt from "bcrypt";
import { cookies } from "next/headers";

export default async function signin(form: FormData) {
  let formData;
  try {
    formData = UserSchema.parse(Object.fromEntries(form.entries()));
  } catch (e) {
    return "validation failed";
  }

  const user = await prisma.user.findFirst({
    where: {
      username: formData.username
    }
  });

  if (!user || !(await bcrypt.compare(formData.password, user.passwordHash))) {
    return "invalid username or password";
  }

  const newAuthToken = uuid();

  try {
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        authToken: newAuthToken
      }
    });
  } catch (e) {
    return "some weird shit happened";
  }

  // @ts-ignore
  cookies().set("token", newAuthToken);
  redirect("/posts");
}
