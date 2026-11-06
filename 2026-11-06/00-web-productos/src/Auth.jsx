import { createContext, useCallback, useContext, useState } from "react";

// Contexto para compartir el estado de autenticacion/autorizacion
const AuthContext = createContext(null);

// Hook personzalizado para acceder al contexto de auth
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [esAdmin, setEsAdmin] = useState(null);
  const [error, setError] = useState(null);

  const login = useCallback(async (username, password) => {
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const session = await response.json();

      if (!response.ok && response.status === 400) {
        throw new Error(session);
      }

      setToken(session.token);
      setUsername(session.username);
      setEsAdmin(session.esAdmin);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUsername(null);
    setEsAdmin(null);
    setError(null);
  }, []);

  const fetchAuth = useCallback(
    async (url, options = {}) => {
      if (!token) {
        throw new Error("No esta iniciada la session");
      }

      return fetch(url, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${token}` },
      });
    },
    [token],
  );

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        esAdmin,
        error,
        isAuthenticated: !!token,
        login,
        logout,
        fetchAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
