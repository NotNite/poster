"use client";

import signin from "@/actions/signin";
import FormWithError from "../components/FormWithError";

export default function SigninForm() {
  return (
    <FormWithError action={signin}>
      <input type="text" name="username" placeholder="username" />
      <input type="password" name="password" placeholder="password" />
      <button type="submit">do it</button>
    </FormWithError>
  );
}
