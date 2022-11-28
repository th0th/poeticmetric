import classNames from "classnames";
import { omit } from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { Card, CardProps, Form } from "react-bootstrap";
import { PageViews } from "./PageViews";
import { Visitors } from "./Visitors";

export type SitePageViewsAndVisitorsReportProps = Omit<CardProps, "children">;

type Section = {
  content: React.ReactNode;
  slug: string | null;
  title: string;
};

const sectionSlugRouterQueryKey = "pageViewsAndVisitors";

const sections: Array<Section> = [
  { content: <PageViews />, slug: null, title: "Page views" },
  { content: <Visitors />, slug: "visitors", title: "Visitors" },
];

export function SitePageViewsAndVisitorsReport({ className, ...props }: SitePageViewsAndVisitorsReportProps) {
  const router = useRouter();

  const section = useMemo<Section>(() => {
    const slug = router.query[sectionSlugRouterQueryKey]?.toString() || null;

    return sections.find((s) => s.slug === slug) || sections.find((s) => s.slug === null) || sections[0];
  }, [router.query]);


  const handleSectionChange = useCallback<React.ChangeEventHandler<HTMLSelectElement>>(async (event) => {
    const query = omit(router.query, sectionSlugRouterQueryKey);

    if (event.target.value !== "") {
      query[sectionSlugRouterQueryKey] = event.target.value;
    }

    await router.push({ pathname: router.pathname, query });
  }, [router]);

  return (
    <Card {...props} className={classNames("h-100 site-report-card", className)}>
      <Card.Body className="d-flex flex-column flex-grow-1">
        <div className="align-items-center d-flex flex-row gap-3 mb-2">
          <Card.Title className="fs-6 mb-0">Page views and visitors</Card.Title>

          <div className="ms-auto">
            <Form.Select onChange={handleSectionChange} size="sm" value={router.query[sectionSlugRouterQueryKey] || ""}>
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
