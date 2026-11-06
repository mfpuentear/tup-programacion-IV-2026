import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useAuth } from "./Auth";

export function UsuarioDetalles() {
  const [usuario, setUsuario] = useState(null);
  const { id } = useParams();
  const { fetchAuth } = useAuth();

  const obtenerUsuario = useCallback(async () => {
    const url = new URL(`http://localhost:3000/usuarios/${id}`);

    const response = await fetchAuth(url);

    if (!response.ok) {
      console.error("Fallo al pedir detalles de usuario");
      setUsuario(null);
      return;
    }

    const usuario = await response.json();

    setUsuario(usuario);
  }, [id, fetchAuth]);

  useEffect(() => {
    obtenerUsuario();
  }, [obtenerUsuario]);

  if (!usuario | !id) {
    return null;
  }

  return (
    <>
      <h2>Detalles de usuario</h2>
      <p>
        Apellidos: <b>{usuario.apellidos}</b>
      </p>
      <p>
        Nombres: <b>{usuario.nombres}</b>
      </p>
      <p>
        Nombre de usuario: <b>{usuario.username}</b>
      </p>
      <p>
        Es administrador: <b>{usuario.es_admin === 1 ? "Si" : "No"}</b>
      </p>
      <Link to="/usuarios">
        <button>Volver</button>
      </Link>
    </>
  );
}
