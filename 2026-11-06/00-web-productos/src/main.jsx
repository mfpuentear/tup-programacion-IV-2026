import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import { Layout } from "./Layout";
import { Home } from "./Home";
import { Productos } from "./Productos";
import { ProductoDetalles } from "./ProductoDetalles";
import { ProductoCrear } from "./ProductoCrear";
import { Usuarios } from "./Usuarios";
import { UsuarioDetalles } from "./UsuariosDetalles";
import { AuthLayout } from "./AuthLayout";
import { AuthProvider } from "./Auth";
import { Login } from "./Login";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />

            <Route path="productos" element={<AuthLayout />}>
              <Route index element={<Productos />} />
              <Route path=":id" element={<ProductoDetalles />} />
              <Route path="crear" element={<ProductoCrear />} />
            </Route>

            <Route path="usuarios" element={<AuthLayout soloAdmin />}>
              <Route index element={<Usuarios />} />
              <Route path=":id" element={<UsuarioDetalles />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
