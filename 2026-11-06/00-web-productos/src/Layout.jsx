import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "./Auth";

export function Layout() {
  const { isAuthenticated, esAdmin, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <main>
      <nav>
        <ul>
          <li className={pathname === "/" ? "active" : ""}>
            <Link to="/">Inicio</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className={pathname.startsWith("/productos") ? "active" : ""}>
                <Link to="/productos">Productos</Link>
              </li>
              {esAdmin && (
                <li
                  className={pathname.startsWith("/usuarios") ? "active" : ""}
                >
                  <Link to="/usuarios">Usuarios</Link>
                </li>
              )}
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Salir
              </button>
            </>
          ) : (
            <li className={pathname.startsWith("/login") ? "active" : ""}>
              <Link to="/login">Ingresar</Link>
            </li>
          )}
        </ul>
      </nav>
      <Outlet />
    </main>
  );
}
