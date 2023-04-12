import { useRouter } from "next/router";
import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { Home, Layout } from "../components";
import { getIsHosted } from "../helpers";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_HOSTED !== "true") {
      router.push("/sign-in");
    }
  }, [router]);

  return getIsHosted() ? (
    <Home />
  ) : (
    <Layout kind="app">
      <Spinner className="m-auto" variant="primary" />
    </Layout>
  );
}
