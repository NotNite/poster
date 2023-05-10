import prisma from "@/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import DeleteAccountButton from "./components/DeleteAccountButton";
import { getUser } from "@/utils";

function Monospace({ children }: { children: React.ReactNode }) {
  return <span style={{ fontFamily: "monospace" }}>{children}</span>;
}

function RedirectButton({ text, href }: { text: string; href: string }) {
  return (
    <form
      action={async () => {
        "use server";
        redirect(href);
      }}
    >
      <button type="submit">{text}</button>
    </form>
  );
}

export default async function Home() {
  const postCount = await prisma.post.count();
  const commentCount = await prisma.comment.count();

  const user = (await getUser()) ?? undefined;

  async function logOut() {
    "use server";

    // @ts-ignore
    cookies().delete("token");
    redirect("/");
  }

  return (
    <main>
      <h1>poster</h1>
      <p>
        i think i hauve Covid
        <br />
        serving <Monospace>{commentCount}</Monospace> comments across{" "}
        <Monospace>{postCount}</Monospace> posts
        <br />
        {user != null ? (
          <>
            logged in as <Monospace>{user.username}</Monospace>
          </>
        ) : (
          <>not logged in</>
        )}
      </p>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <RedirectButton text="posts" href="/posts" />

        {user == null ? (
          <>
            <RedirectButton text="sign in" href="/signin" />
            <RedirectButton text="sign up" href="/signup" />
          </>
        ) : (
          <>
            <form action={logOut}>
              <button type="submit">log out</button>
            </form>
            <DeleteAccountButton id={user.id} />
          </>
        )}
      </div>
    </main>
  );
}
