import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import { Layout } from "./Layout";
import { Home } from "./Home";
import { Productos } from "./Productos";
import { ProductoDetalles } from "./ProductoDetalles";
import { ProductoCrear } from "./ProductoCrear";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="productos">
            <Route index element={<Productos />} />
            <Route path=":id" element={<ProductoDetalles />} />
            <Route path="crear" element={<ProductoCrear />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
