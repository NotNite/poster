import createPost from "@/actions/createPost";
import FormWithError from "@/app/components/FormWithError";
import GoBackButton from "@/app/components/GoBackButton";
import { getUser } from "@/utils";
import { redirect } from "next/navigation";

export default async function CreatePost() {
  const me = await getUser();
  if (me == null) {
    redirect("/");
  }

  return (
    <main>
      <h1>create</h1>

      <FormWithError action={createPost}>
        <input type="text" name="title" placeholder="title" />
        <br />
        <textarea name="content" placeholder="content" />
        <br />
        <textarea name="css" placeholder="css" />
        <br />
        <button type="submit">create</button>
      </FormWithError>

      <GoBackButton />
    </main>
  );
}
