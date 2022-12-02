import classNames from "classnames";
import { omit } from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { Card, CardProps, Form } from "react-bootstrap";
import { Browser } from "./Browser";
import { Device } from "./Device";
import { OperatingSystem } from "./OperatingSystem";

export type SiteTechReportProps = Omit<CardProps, "children">;

type Section = {
  content: React.ReactNode;
  slug: string | null;
  title: string;
};

const slugRouterQueryKey = "pages";

const sections: Array<Section> = [
  { content: <Device />, slug: null, title: "Devices" },
  { content: <Browser />, slug: "browsers", title: "Browsers" },
  { content: <OperatingSystem />, slug: "operating-systems", title: "Operating systems" },
];

export function SiteTechReport({ className, ...props }: SiteTechReportProps) {
  const router = useRouter();

  const section = useMemo<Section>(() => {
    const slug = router.query[slugRouterQueryKey]?.toString() || null;

    return sections.find((s) => s.slug === slug) || sections.find((s) => s.slug === null) || sections[0];
  }, [router.query]);

  const handleSectionChange = useCallback<React.ChangeEventHandler<HTMLSelectElement>>(async (event) => {
    const query = omit(router.query, slugRouterQueryKey);

    if (event.target.value !== "") {
      query[slugRouterQueryKey] = event.target.value;
    }

    await router.push({ pathname: router.pathname, query }, undefined, { scroll: false });
  }, [router]);

  return (
    <Card {...props} className={classNames("overflow-hidden site-report-card", className)}>
      <Card.Body className="d-flex flex-column pb-0 pe-0 ps-0">
        <div className="align-items-center d-flex flex-row gap-3 mb-2 pe-3 ps-3">
          <Card.Title className="fs-6 mb-0">Technology</Card.Title>

          <div className="ms-auto">
            <Form.Select onChange={handleSectionChange} size="sm" value={router.query[slugRouterQueryKey] || ""}>
              {sections.map((s) => (
                <option key={s.title} value={s.slug || ""}>{s.title}</option>
              ))}
            </Form.Select>
          </div>
        </div>

        <div className="d-flex flex-column flex-grow-1 flex-shrink-1">
          {section.content}
        </div>
      </Card.Body>
    </Card>
  );
}
