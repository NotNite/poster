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
  const authToken = cookies().get("token")?.value;
  const me = await prisma.user.findFirst({
    where: {
      authToken: authToken
    }
  });

  async function createPost(form: FormData) {
    "use server";

    const formData = CreatePostSchema.parse({
      title: form.get("title"),
      content: form.get("content")
    });

    const post = await prisma.post.create({
      data: {
        title: formData.title,
        authorId: me!.id
      }
    });

    const comment = await prisma.comment.create({
      data: {
        content: formData.content,
        postId: post.id,
        authorId: me!.id
      }
    });

    redirect(`/posts/${post.id}`);
  }

  return (
    <main>
      <h1>create</h1>
      {me != null ? (
        <form action={createPost}>
          <input type="text" name="title" placeholder="title" />
          <textarea name="content" placeholder="content" />
          <button type="submit">create</button>
        </form>
      ) : (
        <p>kill yourself</p>
      )}
    </main>
  );
}
