import GoBackButton from "@/app/components/GoBackButton";
import { useUser } from "@/app/components/useUser";
import prisma from "@/prisma";
import { CreateCommentSchema } from "@/schema";
import { User, Comment } from "@prisma/client";
import { redirect } from "next/navigation";
import postcss from "postcss";
import postcssjs from "postcss-js";

function CommentComponent({
  comment,
  author
}: {
  comment: Comment;
  author: User;
}) {
  // weak attempt at sandboxing css
  // $5 on cashapp if you break this
  let css = {};
  if (comment.css != null) {
    const root = postcss.parse(comment.css);
    css = postcssjs.objectify(root);
  }

  return (
    <div style={css}>
      <b>
        {author.username}, at {comment.timestamp.toString()}, says:
      </b>
      <p>{comment.content}</p>
    </div>
  );
}

export default async function Post({ params }: { params: { id: string } }) {
  const me = await useUser();

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

    const formData = CreateCommentSchema.parse(
      Object.fromEntries(form.entries())
    );

    await prisma.comment.create({
      data: {
        content: formData.content,
        css: formData.css,
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

      <hr />

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
        <>
          <hr />
          <form action={submitComment}>
            <textarea name="content" placeholder="content" />
            <br />
            <textarea name="css" placeholder="css" />
            <br />
            <button type="submit">post</button>
          </form>
        </>
      )}

      <GoBackButton />
    </main>
  );
}
