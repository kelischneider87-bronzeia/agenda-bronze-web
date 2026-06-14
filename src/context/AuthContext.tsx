"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

type AuthContextType = {
  autenticado: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  autenticado: false,
  login: () => {},
  logout: () => {}
});

export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {

  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {

    const authSalvo = localStorage.getItem("auth");

    if (authSalvo === "true") {
      setAutenticado(true);
    }

  }, []);

  function login() {

    localStorage.setItem("auth", "true");

    setAutenticado(true);
  }

  function logout() {

    localStorage.removeItem("auth");

    setAutenticado(false);
  }

  return (
    <AuthContext.Provider
      value={{
        autenticado,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}