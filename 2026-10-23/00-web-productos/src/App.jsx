import { useEffect, useState } from "react";

function App() {
  const [productos, setProductos] = useState([]);

  const obtenerProductos = async () => {
    const response = await fetch("http://localhost:3000/productos");

    if (!response.ok) {
      console.error("Fallo al pedir productos");
      return;
    }

    const productos = await response.json();

    setProductos(productos);
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <main>
      <h1>Productos</h1>
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
