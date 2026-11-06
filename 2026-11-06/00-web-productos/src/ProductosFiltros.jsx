export function ProductosFiltros({ filtros, onChange }) {
  return (
    <>
      <h2>Filtros</h2>
      <label htmlFor="filtroNombre">Nombre:</label>
      <input
        type="text"
        id="filtroNombre"
        value={filtros.nombre}
        onChange={(e) => onChange((f) => ({ ...f, nombre: e.target.value }))}
      />
      <label htmlFor="filtroCantidadMin">Cantidad mínima:</label>
      <input
        type="number"
        id="filtroCantidadMin"
        min={0}
        value={filtros.cantidadMin}
        onChange={(e) =>
          onChange((f) => ({ ...f, cantidadMin: Number(e.target.value) }))
        }
      />
      <label htmlFor="filtroCantidadMax">Cantidad máxima:</label>
      <input
        type="number"
        id="filtroCantidadMax"
        min={0}
        value={filtros.cantidadMax}
        onChange={(e) =>
          onChange((f) => ({ ...f, cantidadMax: Number(e.target.value) }))
        }
      />
    </>
  );
}
