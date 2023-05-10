import { getUser } from "@/utils";
import { redirect } from "next/navigation";
import SignupForm from "./SignupForm";
import GoBackButton from "../components/GoBackButton";

export default async function SignUp() {
  const user = await getUser();
  if (user != null) {
    redirect("/posts");
  }

  return (
    <main>
      <h1>signup</h1>
      <SignupForm />
      <GoBackButton />
    </main>
  );
}
