import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import Auth from "~components/Auth";
import SignUpForm from "~components/SignUpForm";

export const metadata: Metadata = {
  alternates: {
    canonical: "/sign-up",
  },
  title: "Sign up",
};

export default function Page() {
  return (
    <div className="container">
      <div className="text-center">
        <h1>Sign up</h1>

        <div className="mt-3">
          {"Already have an account? "}

          <Link href="/sign-in">Sign in</Link>
        </div>
      </div>

      <Auth
        className="mt-4 mx-auto"
        ifUnauthenticated={(
          <SignUpForm className="mt-4 mx-auto" />
        )}
      />
    </div>
  );
}
