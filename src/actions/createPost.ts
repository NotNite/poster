"use server";

import { CreatePostSchema } from "@/schema";
import prisma from "@/prisma";
import { getUser } from "@/utils";
import { redirect } from "next/navigation";

export default async function createPost(form: FormData) {
  let formData;
  try {
    formData = CreatePostSchema.parse(Object.fromEntries(form.entries()));
  } catch (e) {
    return "validation failed";
  }

  const me = await getUser();
  if (me === null) return "not logged in";

  let post;
  try {
    post = await prisma.post.create({
      data: {
        title: formData.title,
        authorId: me!.id
      }
    });

    await prisma.comment.create({
      data: {
        content: formData.content,
        css: formData.css,
        postId: post.id,
        authorId: me!.id
      }
    });
  } catch (e) {
    return "some weird shit happened";
  }

  redirect(`/posts/${post.id}`);
}
