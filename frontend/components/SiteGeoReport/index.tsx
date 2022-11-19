import classNames from "classnames";
import { omit } from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { Card, CardProps, Form } from "react-bootstrap";
import { Language } from "./Language";

export type SiteGeoReportProps = Omit<CardProps, "children">;

type Section = {
  content: React.ReactNode;
  slug: string | null;
  title: string;
};

const sectionSlugRouterQueryKey = "geo";

const sections: Array<Section> = [
  { content: <Language />, slug: null, title: "Language" },
  { content: null, slug: "location", title: "Location" },
];

export function SiteGeoReport({ className, ...props }: SiteGeoReportProps) {
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
    <Card {...props} className={classNames("h-100", className)}>
      <Card.Body className="d-flex flex-column flex-grow-1">
        <div className="align-items-center d-flex flex-row gap-3 mb-2">
          <Card.Title className="fs-6 mb-0">Geography</Card.Title>

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
