"use client";

import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import setUserAccessToken from "~helpers/setUserAccessToken";
import useAuthUser from "~hooks/useAuthUser";

export default function SignOut() {
  const router = useRouter();
  const { mutate } = useAuthUser();

  const signOut = useCallback(async () => {
    setUserAccessToken();
    await mutate();
    await router.replace("/");
  }, [mutate, router]);

  useEffect(() => {
    signOut();
  }, [signOut]);

  return (
    <div className="m-auto spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}
