import prisma from "@/prisma";
import { CreateCommentSchema } from "@/schema";
import { User, Comment } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function CommentComponent({
  comment,
  author
}: {
  comment: Comment;
  author: User;
}) {
  return (
    <div>
      <b>
        {author.username}, at {comment.timestamp.toString()}, says:
      </b>
      <p>{comment.content}</p>
    </div>
  );
}

export default async function Post({ params }: { params: { id: string } }) {
  const authToken = cookies().get("token")?.value;
  const me = await prisma.user.findFirst({
    where: {
      authToken: authToken
    }
  });

  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(params.id)
    },
    include: {
      comments: true
    }
  });

  const commentAuthors = await prisma.user.findMany({
    where: {
      id: {
        in: post!.comments.map((comment) => comment.authorId)
      }
    }
  });
  const author = commentAuthors.find((author) => author.id === post!.authorId)!;

  if (post == null) {
    return <p>post not found</p>;
  }

  async function submitComment(form: FormData) {
    "use server";

    const formData = CreateCommentSchema.parse({
      content: form.get("content")
    });

    await prisma.comment.create({
      data: {
        content: formData.content,
        postId: post!.id,
        authorId: me!.id
      }
    });

    redirect(`/posts/${post!.id}`);
  }

  return (
    <main>
      <h1>{post.title}</h1>
      <p>
        by {author!.username} at {post.timestamp.toString()}
      </p>

      <div>
        {post.comments.map((comment) => (
          <>
            <CommentComponent
              key={comment.id}
              comment={comment}
              author={commentAuthors.find((a) => a.id === comment.authorId)!}
            />
            <br />
          </>
        ))}
      </div>

      {me != null && (
        <form action={submitComment}>
          <textarea name="content" placeholder="content" />
          <button type="submit">post</button>
        </form>
      )}
    </main>
  );
}
