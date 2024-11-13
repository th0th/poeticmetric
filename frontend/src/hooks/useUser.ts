import { useContext } from "react";
import AuthContext from "~/contexts/AuthContext";

export default function useUser() {
  const { user } = useContext(AuthContext);

  if (AuthContext === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return user;
}
