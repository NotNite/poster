"use client";

import signup from "@/actions/signup";
import FormWithError from "../components/FormWithError";

export default function SignupForm() {
  return (
    <FormWithError action={signup}>
      <input type="text" name="username" placeholder="username" />
      <input type="password" name="password" placeholder="password" />
      <button type="submit">do it</button>
    </FormWithError>
  );
}
