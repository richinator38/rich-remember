import { signIn } from "next-auth/react";

export default function AccessDenied() {
  return (
    <>
      <h1 className="text-xl font-bold text-center mb-8">Access Denied</h1>
      <p>
        <button
          className="text-lg underline"
          onClick={(e) => {
            e.preventDefault();
            signIn();
          }}
        >
          You must be signed in to view this page
        </button>
      </p>
    </>
  );
}
