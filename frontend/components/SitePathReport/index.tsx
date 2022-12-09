import { omit } from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { Card, CardProps, Form } from "react-bootstrap";
import { Durations } from "./Durations";
import { Visitor } from "./Visitor";

export type SitePathReportProps = Omit<CardProps, "children">;

type Section = {
  content: React.ReactNode;
  slug: string | null;
  title: string;
};

const slugRouterQueryKey = "pages";

const sections: Array<Section> = [
  { content: <Visitor />, slug: null, title: "Visitors" },
  { content: <Durations />, slug: "duration", title: "Duration" },
];

export function SitePathReport({ className, ...props }: SitePathReportProps) {
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
    <Card {...props} className={`site-report-card ${className}`}>
      <Card.Body className="d-flex flex-column">
        <div className="align-items-center d-flex flex-row gap-3 mb-2">
          <Card.Title className="fs-6 mb-0">Pages</Card.Title>

          <div className="ms-auto">
            <Form.Select onChange={handleSectionChange} size="sm" value={router.query[slugRouterQueryKey] || ""}>
              {sections.map((s) => (
                <option key={s.title} value={s.slug || ""}>{s.title}</option>
              ))}
            </Form.Select>
          </div>
        </div>

        {section.content}
      </Card.Body>
    </Card>
  );
}
