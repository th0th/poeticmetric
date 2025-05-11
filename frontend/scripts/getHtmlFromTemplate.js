export default function getHtmlFromTemplate(template, rendered) {
  return template.replace("<!--head-->", rendered.head).replace("<!--b-->", rendered.html);
}
