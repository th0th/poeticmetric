import { useParams } from "react-router";
import Breadcrumb from "~/components/Breadcrumb";
import CanonicalLink from "~/components/CanonicalLink";
import Markdown from "~/components/Markdown";
import NotFound from "~/components/NotFound";
import Title from "~/components/Title";
import DocsArticleContext from "~/contexts/DocsArticleContext";
import { getDocsCategories } from "~/lib/docs";
import Menu from "./Menu";

const docsCategories = getDocsCategories();

export default function DocsArticle() {
  const { docsArticleSlug, docsCategorySlug } = useParams();
  const category = docsCategorySlug === undefined ? docsCategories[0] : docsCategories.find((p) => p.slug === docsCategorySlug);
  const article = docsArticleSlug === undefined ? category?.articles[0] : category?.articles.find((p) => p.slug === docsArticleSlug);

  return category === undefined || article === undefined ? (
    <NotFound />
  ) : (
    <DocsArticleContext.Provider value={{ article, category }}>
      <Title template="docs">{`${category.title} - ${article.title}`}</Title>
      <CanonicalLink path={`/docs/${category.slug}/${article.slug}`} />

      <div className="container-fluid d-flex flex-grow-1">
        <div className="bg-body row">
          <div className="border-end-md d-flex flex-column flex-shrink-0 w-md-16rem">
            <Menu />
          </div>

          <div className="col">
            <div className="p-10">
              <Breadcrumb>
                <Breadcrumb.Items>
                  <Breadcrumb.Item to="/docs">Docs</Breadcrumb.Item>
                  <Breadcrumb.Item>{category.title}</Breadcrumb.Item>
                </Breadcrumb.Items>

                <Breadcrumb.Title>{article.title}</Breadcrumb.Title>
              </Breadcrumb>

              <article className="lh-lg mw-50rem position-relative pt-4 z-1">
                <Markdown path={article.path} type="docsArticle">
                  {`<TableOfContents />\n${article.content}`}
                </Markdown>
              </article>
            </div>
          </div>
        </div>
      </div>
    </DocsArticleContext.Provider>
  );
}

export const Component = DocsArticle;
