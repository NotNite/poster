import { getUser } from "@/utils";
import { redirect } from "next/navigation";
import SigninForm from "./SigninForm";
import GoBackButton from "../components/GoBackButton";

export default async function SignIn() {
  const user = await getUser();
  if (user != null) {
    redirect("/posts");
  }

  return (
    <main>
      <h1>signin</h1>
      <SigninForm />
      <GoBackButton />
    </main>
  );
}
