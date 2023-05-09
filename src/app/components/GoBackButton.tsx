"use client";

import { useRouter } from "next/navigation";

export default function GoBackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        router.push(window.location.href + "/..");
      }}
    >
      go back
    </button>
  );
}
