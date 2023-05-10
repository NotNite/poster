import prisma from "@/prisma";
import { Post, User } from "@prisma/client";
import { redirect } from "next/navigation";
import GoBackButton from "../components/GoBackButton";
import { getUser } from "@/utils";

function Post({ post, author }: { post: Post; author: User }) {
  return (
    <a href={`/posts/${post.id}`}>
      <b>{post.title}</b> by {author!.username}, {post.timestamp.toString()}
    </a>
  );
}

export default async function Posts() {
  const me = await getUser();

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
          <>
            <Post
              key={post.id}
              post={post}
              author={authors.find((a) => a.id === post.authorId)!}
            />
            <br />
          </>
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

      <GoBackButton />
    </main>
  );
}
