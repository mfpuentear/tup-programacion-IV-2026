import { useState } from "react";
import { CategoriasSelect } from "./CategoriasSelect";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./Auth";

export function ProductoCrear() {
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    categoriaId: 0,
    cantidad: 0,
  });
  const navigate = useNavigate();
  const { fetchAuth } = useAuth();

  return (
    <>
      <h2>Nuevo producto</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          // TODO: Validar formulario antes de enviar

          const response = await fetchAuth("http://localhost:3000/productos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoProducto),
          });

          if (!response.ok) {
            const err = await response.json();
            console.error(`Error ${response.status}: ${err.mensaje}`);
            return;
          }

          navigate("/productos");
        }}
      >
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          value={nuevoProducto.nombre}
          onChange={(e) =>
            setNuevoProducto((p) => ({ ...p, nombre: e.target.value }))
          }
        />

        <CategoriasSelect
          categoriaId={nuevoProducto.categoriaId}
          onChange={(categoriaId) =>
            setNuevoProducto((p) => ({ ...p, categoriaId }))
          }
        />

        <label htmlFor="cantidad">Cantidad:</label>
        <input
          type="number"
          id="cantidad"
          min={0}
          value={nuevoProducto.cantidad}
          onChange={(e) =>
            setNuevoProducto((p) => ({
              ...p,
              cantidad: Number(e.target.value),
            }))
          }
        />

        <div>
          <button type="submit">Crear</button>
          <Link to="/productos">
            <button>Volver</button>
          </Link>
        </div>
      </form>
    </>
  );
}
