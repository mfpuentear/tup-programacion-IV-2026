import { useEffect, useState } from "react";

function App() {
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({
    nombre: "",
    cantidadMin: 0,
    cantidadMax: 0,
  });
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    categoriaId: 0,
    cantidad: 0,
  });
  const [categorias, setCategorias] = useState([]);

  const obtenerProductos = async () => {
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
  };

  const obtenerCategorias = async () => {
    const response = await fetch("http://localhost:3000/categorias");

    if (!response.ok) {
      console.error("Fallo al pedir categorias");
      return;
    }

    const categorias = await response.json();

    setCategorias(categorias);
  };

  useEffect(() => {
    obtenerProductos();
  }, [filtros]);

  useEffect(() => {
    obtenerCategorias();
  }, []);

  return (
    <main>
      <h1>Productos</h1>

      <h2>Filtros</h2>
      <label htmlFor="filtroNombre">Nombre:</label>
      <input
        type="text"
        id="filtroNombre"
        value={filtros.nombre}
        onChange={(e) => setFiltros((f) => ({ ...f, nombre: e.target.value }))}
      />
      <label htmlFor="filtroCantidadMin">Cantidad mínima:</label>
      <input
        type="number"
        id="filtroCantidadMin"
        min={0}
        value={filtros.cantidadMin}
        onChange={(e) =>
          setFiltros((f) => ({ ...f, cantidadMin: Number(e.target.value) }))
        }
      />
      <label htmlFor="filtroCantidadMax">Cantidad máxima:</label>
      <input
        type="number"
        id="filtroCantidadMax"
        min={0}
        value={filtros.cantidadMax}
        onChange={(e) =>
          setFiltros((f) => ({ ...f, cantidadMax: Number(e.target.value) }))
        }
      />

      <h2>Nuevo producto</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          // TODO: Validar formulario antes de enviar

          const response = await fetch("http://localhost:3000/productos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoProducto),
          });

          if (!response.ok) {
            const err = await response.json();
            console.error(`Error ${response.status}: ${err.mensaje}`);
            return;
          }

          obtenerProductos();
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
        <label htmlFor="categoria">Categoría:</label>
        <select
          id="categoria"
          value={nuevoProducto.categoriaId}
          onChange={(e) =>
            setNuevoProducto((p) => ({
              ...p,
              categoriaId: Number(e.target.value),
            }))
          }
        >
          <option value={0}>Seleccione una categoria</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <label htmlFor="cantidad">Cantidad:</label>
        <input
          type="number"
          id="cantidad"
          min={0}
          value={nuevoProducto.cantidad}
          onChange={(e) =>
            setNuevoProducto((f) => ({
              ...f,
              cantidad: Number(e.target.value),
            }))
          }
        />
        <button type="submit">Crear</button>
      </form>

      <h2>Listado</h2>
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
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>{producto.categoria}</td>
              <td>{producto.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default App;
