import prisma from "@/prisma";
import { cookies } from "next/headers";

export async function useUser() {
  const user = await prisma.user.findFirst({
    where: {
      authToken: cookies().get("token")?.value
    }
  });

  return user;
}
