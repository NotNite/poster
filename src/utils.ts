import prisma from "@/prisma";
import { cookies } from "next/headers";

export async function deleteComment(id: number) {
  await prisma.comment.delete({
    where: {
      id
    }
  });
}

export async function deletePost(id: number) {
  await prisma.comment.deleteMany({
    where: {
      postId: id
    }
  });

  await prisma.post.delete({
    where: {
      id
    }
  });
}

export async function deleteUser(id: number) {
  await prisma.comment.deleteMany({
    where: {
      authorId: id
    }
  });

  const posts = await prisma.post.findMany({
    where: {
      authorId: id
    }
  });

  for (const post of posts) {
    await deletePost(post.id);
  }

  await prisma.user.delete({
    where: {
      id
    }
  });
}

export async function getUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (token == null) return null;

  const user = await prisma.user.findFirst({
    where: {
      authToken: token
    }
  });

  return user;
}
