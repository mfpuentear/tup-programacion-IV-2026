import { Link, Outlet, useLocation } from "react-router";

export function Layout() {
  const { pathname } = useLocation();

  return (
    <main>
      <nav>
        <ul>
          <li className={pathname === "/" ? "active" : ""}>
            <Link to="/">Inicio</Link>
          </li>
          <li className={pathname.startsWith("/productos") ? "active" : ""}>
            <Link to="/productos">Productos</Link>
          </li>
          <li className={pathname.startsWith("/usuarios") ? "active" : ""}>
            <Link to="/usuarios">Usuarios</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </main>
  );
}
