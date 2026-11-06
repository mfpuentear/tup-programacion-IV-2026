import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useAuth } from "./Auth";

export function ProductoDetalles() {
  const [producto, setProducto] = useState(null);
  const { id } = useParams();
  const { fetchAuth } = useAuth();

  const obtenerProductos = useCallback(async () => {
    const url = new URL(`http://localhost:3000/productos/${id}`);

    const response = await fetchAuth(url);

    if (!response.ok) {
      console.error("Fallo al pedir detalles de producto");
      setProducto(null);
      return;
    }

    const producto = await response.json();

    setProducto(producto);
  }, [id, fetchAuth]);

  useEffect(() => {
    obtenerProductos();
  }, [obtenerProductos]);

  if (!producto | !id) {
    return null;
  }

  return (
    <>
      <h2>Detalle de producto</h2>
      <p>
        Nombre: <b>{producto.nombre}</b>
      </p>
      <p>
        Categoria: <b>{producto.categoria}</b>
      </p>
      <p>
        Cantidad: <b>{producto.cantidad}</b>
      </p>
      <Link to="/productos">
        <button>Volver</button>
      </Link>
    </>
  );
}
