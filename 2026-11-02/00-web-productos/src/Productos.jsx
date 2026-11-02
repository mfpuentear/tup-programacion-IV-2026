import { useCallback, useEffect, useState } from "react";
import { ProductosFiltros } from "./ProductosFiltros";
import { Link } from "react-router";

export function Productos() {
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({
    nombre: "",
    cantidadMin: 0,
    cantidadMax: 0,
  });

  const obtenerProductos = useCallback(async () => {
    const url = new URL("http://localhost:3000/productos");

    if (filtros.nombre) {
      url.searchParams.append("nombre", filtros.nombre);
    }
    if (filtros.cantidadMin > 0) {
      url.searchParams.append("cantidadMin", filtros.cantidadMin);
    }
    if (filtros.cantidadMax > 0) {
      url.searchParams.append("cantidadMax", filtros.cantidadMax);
    }

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Fallo al pedir productos");
      setProductos([]);
      return;
    }

    const productos = await response.json();

    setProductos(productos);
  }, [filtros]);

  useEffect(() => {
    obtenerProductos();
  }, [obtenerProductos]);

  return (
    <>
      <h1>Productos</h1>

      <ProductosFiltros filtros={filtros} onChange={setFiltros} />

      <h2>Listado</h2>

      <Link to="/productos/crear">
        <button>Nuevo producto</button>
      </Link>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoria</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>
                <Link to={`/productos/${producto.id}`}>{producto.id}</Link>{" "}
              </td>
              <td>{producto.nombre}</td>
              <td>{producto.categoria}</td>
              <td>{producto.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
