import prisma from "@/prisma";
import { UserSchema } from "@/schema";
import * as bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { useUser } from "../components/useUser";

export default async function SignUp() {
  const user = await useUser();
  if (user != null) {
    redirect("/posts");
  }

  async function signup(form: FormData) {
    "use server";

    const formData = UserSchema.parse(Object.fromEntries(form.entries()));
    const hash = await bcrypt.hash(formData.password, 10);
    const user = await prisma.user.create({
      data: {
        username: formData.username,
        passwordHash: hash,
        authToken: uuid()
      }
    });

    // @ts-ignore
    cookies().set("token", user.authToken);
    redirect("/posts");
  }

  return (
    <main>
      <h1>signup</h1>

      <form action={signup}>
        <input type="text" name="username" placeholder="username" />
        <input type="password" name="password" placeholder="password" />
        <button type="submit">do it</button>
      </form>
    </main>
  );
}
