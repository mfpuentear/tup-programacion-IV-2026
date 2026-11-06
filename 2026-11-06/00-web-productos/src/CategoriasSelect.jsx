import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./Auth";

export function CategoriasSelect({ categoriaId, onChange }) {
  const [categorias, setCategorias] = useState([]);
  const { fetchAuth } = useAuth();

  const obtenerCategorias = useCallback(async () => {
    const response = await fetchAuth("http://localhost:3000/categorias");

    if (!response.ok) {
      console.error("Fallo al pedir categorias");
      return;
    }

    const categorias = await response.json();

    setCategorias(categorias);
  }, [fetchAuth]);

  useEffect(() => {
    obtenerCategorias();
  }, [obtenerCategorias]);

  return (
    <>
      <label htmlFor="categoria">Categoría:</label>
      <select
        id="categoria"
        value={categoriaId}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value={0}>Seleccione una categoria</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>
    </>
  );
}
