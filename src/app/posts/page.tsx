import prisma from "@/prisma";
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

export default async function Posts() {
  const authToken = cookies().get("token")?.value;

  const me = await prisma.user.findFirst({
    where: {
      authToken: authToken
    }
  });

  const posts = await prisma.post.findMany({
    orderBy: {
      timestamp: "desc"
    }
  });

  const authors = await prisma.user.findMany({
    where: {
      id: {
        in: posts.map((post) => post.authorId)
      }
    }
  });

  return (
    <main>
      <h1>posts</h1>
      <div>
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            author={authors.find((a) => a.id === post.authorId)!}
          />
        ))}
      </div>

      {me != null && (
        <form>
          <button
            type="submit"
            formAction={async () => {
              "use server";
              redirect("/posts/create");
            }}
          >
            create post
          </button>
        </form>
      )}
    </main>
  );
}
