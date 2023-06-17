import getPost from "~helpers/blog/getPost";
import getPostSlugs from "~helpers/blog/getPostSlugs";

export default function getPosts(page: number): Array<BlogPost> {
  const postSlugs = getPostSlugs().slice((page - 1) * 10, (page * 10) - 1);

  return postSlugs.map((slug) => getPost(slug));
}
