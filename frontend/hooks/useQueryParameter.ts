import { useRouter } from "next/router";
import { useMemo } from "react";

type R<T> = {
  hasError: boolean;
  isReady: boolean;
  value?: T;
};

export function useQueryParameter(key: string, type: "number"): R<number>;
export function useQueryParameter(key: string, type: "string"): R<string>;
export function useQueryParameter(key: string, type: "number" | "string"): R<number | string> {
  const router = useRouter();

  return useMemo<R<number | string>>(() => {
    if (!router.isReady) {
      return {
        hasError: false,
        isReady: false,
      };
    }

    const rawValue = router.query[key];

    if (rawValue === undefined) {
      return {
        hasError: false,
        isReady: true,
      };
    }

    if (typeof rawValue !== "string") {
      return {
        hasError: true,
        isReady: true,
      };
    }

    if (typeof rawValue !== "string") {
      return {
        hasError: false,
        isReady: true,
        value: rawValue,
      };
    }

    if (type === "number") {
      const value = Number(rawValue);

      if (Number.isNaN(value)) {
        return {
          hasError: true,
          isReady: true,
        };
      }

      return {
        hasError: false,
        isReady: true,
        value,
      };
    }

    if (type === "string") {
      return {
        hasError: false,
        isReady: true,
        value: rawValue,
      };
    }

    throw new Error("Invalid type.");
  }, [key, router.isReady, router.query, type]);
}
