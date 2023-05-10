"use client";

import React from "react";

export default function FormWithError({
  action,
  children
}: {
  action: (form: FormData) => Promise<string | null>;
  children: React.ReactNode;
}) {
  const [error, setError] = React.useState<string | null>(null);

  return (
    <>
      {error != null && <p>{error}</p>}
      <form
        action={async (form) => {
          const err = await action(form);
          if (err != null) setError(err);
        }}
      >
        {children}
      </form>
    </>
  );
}
