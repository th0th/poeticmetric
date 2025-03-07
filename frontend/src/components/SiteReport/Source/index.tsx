import { ReactNode, useCallback, useMemo } from "react";
import { Dropdown, DropdownProps } from "react-bootstrap";
import { useSearchParams } from "wouter";
import Referrer from "~/components/SiteReport/Source/Referrer";

type Section = {
  content: ReactNode;
  slug?: string;
  title: string;
};

const routerQuerySectionSlugKey = "source";

export default function Source() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sections: Array<Section> = useMemo(() => [
    { content: <Referrer />, title: "Referrers" },
    { content: null, slug: "google-search-terms", title: "Google search terms" },
  ], []);
  const section = useMemo<Section>(() => {
    const slug = searchParams.get(routerQuerySectionSlugKey);

    return sections.find((s) => s.slug === slug) || sections.find((s) => s.slug === null) || sections[0];
  }, [searchParams, sections]);

  const handleDropdownSelect = useCallback<Exclude<DropdownProps["onSelect"], undefined>>((key) => {
    setSearchParams((s) => {
      if (typeof key === "string") {
        s.set(routerQuerySectionSlugKey, key);
      } else {
        s.delete(routerQuerySectionSlugKey);
      }

      return s;
    });
  }, [setSearchParams]);

  return (
    <div className="card">
      <div className="card-body d-flex flex-column h-18rem">
        <div className="align-items-center d-flex h-2rem mb-6">
          <Dropdown onSelect={handleDropdownSelect}>
            <Dropdown.Toggle as="button" className="bg-transparent bg-opacity-10-hover bg-primary-hover border-0 fw-medium px-4 rounded">
              {section.title}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {sections.map((d) => (
                <Dropdown.Item eventKey={d.slug} key={d.title}>{d.title}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {section.content}
      </div>
    </div>
  );
}
