"use client";

import React from "react";
import deleteAccount from "../../actions/deleteAccount";

export default function DeleteAccountButton({ id }: { id: number }) {
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  return (
    <form
      action={async () => {
        if (confirmDelete) {
          await deleteAccount();
        } else {
          setConfirmDelete(true);
        }
      }}
    >
      <button type="submit">
        {"delete account" + (confirmDelete ? " (click again)" : "")}
      </button>
    </form>
  );
}
