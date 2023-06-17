import Cookies from "js-cookie";

export default function getUserAccessToken() {
  return Cookies.get("at");
}
