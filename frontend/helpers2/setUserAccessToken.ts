import Cookies from "js-cookie";

export default function setUserAccessToken(token?: string) {
  if (token === undefined) {
    Cookies.remove("at");
  } else {
    Cookies.set("at", token);
  }
}
