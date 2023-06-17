import React, { createContext } from "react";

export type ToastsContextToast = {
  body: React.ReactNode;
  id: string;
  variant: "light" | "danger" | "success";
};

export type ToastsContextValue = {
  addToast: (toast: Omit<ToastsContextToast, "id">) => any;
  deleteToast: (key: ToastsContextToast["id"]) => any;
  toasts: Array<ToastsContextToast>;
};

export default createContext<ToastsContextValue>({
  addToast: (_: Omit<ToastsContextToast, "id">) => null,
  deleteToast: (_: ToastsContextToast["id"]) => null,
  toasts: [],
});
