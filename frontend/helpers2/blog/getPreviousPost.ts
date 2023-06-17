import getPost from "~helpers/blog/getPost";
import getPostSlugs from "~helpers/blog/getPostSlugs";

export default function getPreviousPost(slug: string): BlogPost | null {
  const postSlugs = getPostSlugs();
  const postSlugIndex = postSlugs.findIndex((s) => s === slug);

  if (postSlugIndex === postSlugs.length - 1) {
    return null;
  }

  const nextPostSlug = postSlugs[postSlugIndex + 1];

  return getPost(nextPostSlug);
}
