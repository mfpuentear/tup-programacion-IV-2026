import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";

export function ProductoDetalles() {
  const { id } = useParams();

  const [producto, setProducto] = useState(null);

  const obtenerProductos = useCallback(async () => {
    const url = new URL(`http://localhost:3000/productos/${id}`);

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Fallo al pedir detalles de producto");
      setProducto(null);
      return;
    }

    const producto = await response.json();

    setProducto(producto);
  }, [id]);

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
