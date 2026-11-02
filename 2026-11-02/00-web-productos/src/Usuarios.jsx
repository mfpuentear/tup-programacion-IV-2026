import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";

export function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  const obtenerUsuarios = useCallback(async () => {
    const url = new URL("http://localhost:3000/usuarios");

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Fallo al pedir productos");
      setUsuarios([]);
      return;
    }

    const usuarios = await response.json();

    setUsuarios(usuarios);
  }, []);

  useEffect(() => {
    obtenerUsuarios();
  }, [obtenerUsuarios]);

  return (
    <>
      <h1>Usuarios</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Apellidos</th>
            <th>Nombres</th>
            <th>Nombre usuario</th>
            <th>Es administrador</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>
                <Link to={`/usuarios/${usuario.id}`}>{usuario.id}</Link>{" "}
              </td>
              <td>{usuario.apellidos}</td>
              <td>{usuario.nombres}</td>
              <td>{usuario.username}</td>
              <td>{usuario.es_admin === 1 ? "Si" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
