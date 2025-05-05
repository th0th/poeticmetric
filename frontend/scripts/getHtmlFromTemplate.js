export default function getHtmlFromTemplate(template, rendered) {
  return template.replace("<!--app-head-->", rendered.head).replace("<!--app-html-->", rendered.body);
}
