import { IconClipboardCheckFilled, IconClipboardFilled, IconRefresh } from "@tabler/icons-react";
import classNames from "classnames";
import copy from "copy-to-clipboard";
import { JSX, PropsWithoutRef, useCallback, useMemo, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SyntaxHighlighter from "~/components/SyntaxHighlighter";
import useSite from "~/hooks/api/useSite";
import { getTrackerURL } from "~/lib/tracker";

export type NoEventsBlockProps = Overwrite<Omit<PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">, {
  siteID: number;
}>;

type State = {
  isCopied: boolean;
};

export default function NoEventsBlock({ className, siteID, ...props }: NoEventsBlockProps) {
  const { isValidating, mutate } = useSite(siteID);
  const [state, setState] = useState<State>({
    isCopied: false,
  });

  const scriptCode = useMemo(() => `<script async src="${getTrackerURL()}"></script>`, []);

  const copyScriptCodeToClipboard = useCallback(() => {
    copy(scriptCode);
    setState((s) => ({ ...s, isCopied: true }));

    setTimeout(() => {
      setState((s) => ({ ...s, isCopied: false }));
    }, 2000);
  }, [scriptCode]);

  return (
    <div {...props} className={classNames("align-items-center d-flex flex-column p-12 text-center", className)}>
      <h2>There are no events registered from this site, yet...</h2>

      <p>Please add the PoeticMetric tracking script to your site:</p>

      <div className="align-items-stretch d-flex flex-row">
        <SyntaxHighlighter className="mb-0 rounded-start" code={scriptCode} />

        <OverlayTrigger
          overlay={(
            <Tooltip className="fs-xs fw-medium" key={Math.random()}>{state.isCopied ? "Copied!" : "Click to copy"}</Tooltip>
          )}
          placement="bottom"
          trigger={["focus", "hover"]}
        >
          <button
            className="btn btn-lg btn-primary d-block flex-grow-0 flex-shrink-0 rounded-start-0"
            onClick={copyScriptCodeToClipboard}
            type="button"
          >
            {state.isCopied ? <IconClipboardCheckFilled /> : <IconClipboardFilled />}
          </button>
        </OverlayTrigger>
      </div>

      <div className="fs-7 mt-2">
        {"Please see "}
        <a href="/docs/websites/adding-the-script-to-your-website" target="_blank">docs</a>
        {" if you need help about adding the script to your website."}
      </div>

      <div className="mt-8">
        <button
          className="align-items-center btn btn-primary d-flex flex-row gap-2"
          disabled={isValidating}
          onClick={() => mutate()}
          type="button"
        >
          <IconRefresh />

          Refresh
        </button>
      </div>
    </div>
  );
}
