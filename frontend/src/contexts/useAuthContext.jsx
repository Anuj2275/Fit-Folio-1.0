import { useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be inside the AuthProvider");
  }
  return ctx;
};
