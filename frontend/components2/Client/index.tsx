"use client";

export type ClientProps = {
  children: React.ReactNode;
};

export default function Client({ children }: ClientProps) {
  return (
    <>
      {children}
    </>
  );
}
