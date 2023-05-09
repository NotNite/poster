import prisma from "@/prisma";
import { UserSchema } from "@/schema";
import * as bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function SignIn() {
  async function login(form: FormData) {
    "use server";

    const formData = UserSchema.parse({
      username: form.get("username"),
      password: form.get("password")
    });

    const hash = await bcrypt.hash(formData.password, 10);
    const user = await prisma.user.findFirst({
      where: {
        username: formData.username
      }
    });
    if (
      !user ||
      !(await bcrypt.compare(formData.password, user.passwordHash))
    ) {
      throw new Error("invalid username or password");
    }

    const newAuthToken = uuid();

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        authToken: newAuthToken
      }
    });

    // @ts-ignore
    cookies().set("token", newAuthToken);
    redirect("/posts");
  }

  return (
    <main>
      <h1>signin</h1>

      <form action={login}>
        <input type="text" name="username" placeholder="username" />
        <input type="password" name="password" placeholder="password" />
        <button type="submit">do it</button>
      </form>
    </main>
  );
}
