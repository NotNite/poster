import GoBackButton from "@/app/components/GoBackButton";
import { useUser } from "@/app/components/useUser";
import prisma from "@/prisma";
import { CreatePostSchema } from "@/schema";
import { Post, User } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function Post({ post, author }: { post: Post; author: User }) {
  return (
    <a href={`/posts/${post.id}`}>
      <b>{post.title}</b> by {author!.username}, {post.timestamp.toString()}
    </a>
  );
}

export default async function CreatePost() {
  const me = await useUser();
  if (me == null) {
    redirect("/");
  }

  async function createPost(form: FormData) {
    "use server";

    const formData = CreatePostSchema.parse(Object.fromEntries(form.entries()));

    const post = await prisma.post.create({
      data: {
        title: formData.title,
        authorId: me!.id
      }
    });

    const comment = await prisma.comment.create({
      data: {
        content: formData.content,
        css: formData.css,
        postId: post.id,
        authorId: me!.id
      }
    });

    redirect(`/posts/${post.id}`);
  }

  return (
    <main>
      <h1>create</h1>
      <form action={createPost}>
        <input type="text" name="title" placeholder="title" />
        <br />
        <textarea name="content" placeholder="content" />
        <br />
        <textarea name="css" placeholder="css" />
        <br />
        <button type="submit">create</button>
      </form>

      <GoBackButton />
    </main>
  );
}
