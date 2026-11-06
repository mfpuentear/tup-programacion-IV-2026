import { Outlet } from "react-router";
import { useAuth } from "./Auth";

export function AuthLayout({ soloAdmin = false }) {
  const { isAuthenticated, esAdmin } = useAuth();

  if (!isAuthenticated) {
    return <p>No esta autenticado</p>;
  }

  if (soloAdmin && !esAdmin) {
    return <p>No esta autorizado</p>;
  }

  return <Outlet />;
}
