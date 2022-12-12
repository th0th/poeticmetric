import { omit } from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { Card, CardProps, Dropdown, DropdownProps } from "react-bootstrap";
import { PageViews } from "./PageViews";
import { Visitors } from "./Visitors";

export type SiteVisitorPageViewReportProps = Omit<CardProps, "children">;

type Section = {
  content: React.ReactNode;
  slug?: string;
  title: string;
};

const routerQuerySectionSlugKey = "visitorsPageViews";

const sections: Array<Section> = [
  { content: <Visitors />, title: "Visitors" },
  { content: <PageViews />, slug: "page-views", title: "Page views" },
];

export function SiteVisitorPageViewReport({ className, ...props }: SiteVisitorPageViewReportProps) {
  const router = useRouter();

  const section = useMemo<Section>(() => {
    const slug = router.query[routerQuerySectionSlugKey]?.toString() || null;

    return sections.find((s) => s.slug === slug) || sections.find((s) => s.slug === null) || sections[0];
  }, [router.query]);

  const handleDropdownSelect = useCallback<Exclude<DropdownProps["onSelect"], undefined>>(async (eventKey) => {
    const query = omit(router.query, routerQuerySectionSlugKey);

    if (eventKey !== null) {
      query[routerQuerySectionSlugKey] = eventKey;
    }

    await router.push({ pathname: router.pathname, query }, undefined, { scroll: false });
  }, [router]);

  return (
    <>
      <Card {...props} className={`site-report-card ${className}`}>
        <Card.Body className="d-flex flex-column">
          <div className="align-items-center d-flex flex-row mb-3">
            <h6 className="mb-0">Visitors and page views</h6>

            <div className="ms-auto">
              <Dropdown onSelect={handleDropdownSelect}>
                <Dropdown.Toggle as={"button"} className="bg-transparent bg-light-hover border-0 d-block fss-2 outline-none my-n1 py-1 rounded-2">
                  {section.title}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {sections.map((d) => (
                    <Dropdown.Item eventKey={d.slug} key={d.title}>
                      {d.title}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          {section.content}
        </Card.Body>
      </Card>
    </>
  );
}
