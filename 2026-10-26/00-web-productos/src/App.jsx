import { useEffect, useState } from "react";

function App() {
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({
    nombre: "",
    cantidadMin: 0,
    cantidadMax: 0,
  });

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

    console.log(url.href);

    const response = await fetch(url);

    if (!response.ok) {
      const mensaje = await response.json();
      console.error(`Error ${response.status}: ${mensaje}`);
      setProductos([]);
      return;
    }

    const productos = await response.json();

    setProductos(productos);
  };

  useEffect(() => {
    obtenerProductos();
  }, [filtros]);

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
