import classNames from "classnames";
import { omit } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { Card, CardProps, Form } from "react-bootstrap";
import { Campaign } from "./Campaign";
import { Content } from "./Content";
import { Medium } from "./Medium";
import { Source } from "./Source";
import { Term } from "./Term";

type SiteUtmReportsProps = Omit<CardProps, "children">;

type Section = {
  content: React.ReactNode;
  slug: string | null;
  title: string;
};

const sectionSlugRouterQueryKey = "utm";

const sections: Array<Section> = [
  { content: <Source />, slug: null, title: "Source" },
  { content: <Campaign />, slug: "campaign", title: "Campaign" },
  { content: <Medium />, slug: "medium", title: "Medium" },
  { content: <Content />, slug: "content", title: "Content" },
  { content: <Term />, slug: "term", title: "Term" },
];

export function SiteUtmReports({ className, ...props }: SiteUtmReportsProps) {
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

    await router.push({ pathname: router.pathname, query }, undefined, { scroll: false });
  }, [router]);

  return (
    <Card {...props} className={classNames("d-flex site-report-card", className)}>
      <Card.Body className="d-flex flex-column flex-grow-1 flex-shrink-1">
        <div className="align-items-center d-flex flex-row h-2rem mb-2">
          <Card.Title className="fs-6 mb-0">UTM</Card.Title>

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

      <Link className="bg-light-hover border-1 border-top d-block fw-semibold py-2 text-center text-decoration-none" href="/" scroll={false}>
        See more
      </Link>
    </Card>
  );
}
