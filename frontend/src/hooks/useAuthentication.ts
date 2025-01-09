import { useContext } from "react";
import AuthenticationContext from "~/contexts/AuthenticationContext";

export default function useAuthentication() {
  return useContext(AuthenticationContext);
}
