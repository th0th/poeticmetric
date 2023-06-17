import getPost from "~helpers/blog/getPost";
import getPostSlugs from "~helpers/blog/getPostSlugs";

export default function getNextPost(slug: string): BlogPost | null {
  const postSlugs = getPostSlugs();
  const postSlugIndex = postSlugs.findIndex((s) => s === slug);

  if (postSlugIndex < 1) {
    return null;
  }

  const previousPostSlug = postSlugs[postSlugIndex - 1];

  return getPost(previousPostSlug);
}
