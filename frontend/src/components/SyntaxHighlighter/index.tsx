import hljs from "highlight.js";
import React, { JSX, useEffect, useRef } from "react";

export type SyntaxHighlighterProps = Overwrite<Omit<React.PropsWithoutRef<JSX.IntrinsicElements["pre"]>, "children">, {
  code: string;
}>;

export default function SyntaxHighlighter({ code, ...props }: SyntaxHighlighterProps) {
  const previousCode = useRef<string>("");
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current !== null && code !== previousCode.current) {
      hljs.highlightElement(codeRef.current);

      previousCode.current = code;
    }
  }, [code]);

  return (
    <pre {...props}>
      <code className="text-break text-wrap" ref={codeRef}>{code}</code>
    </pre>
  );
}
