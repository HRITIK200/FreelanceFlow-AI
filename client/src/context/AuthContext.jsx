import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext =
  createContext();

export const AuthProvider =
  ({ children }) => {

    const [token, setToken] =
      useState(
        localStorage.getItem("token")
      );

    const [user, setUser] =
      useState(() => {
        
        const storedUser =
          localStorage.getItem("user");

        if(!storedUser || storedUser === "undefined"){
          return null;
        }

        try{
          return JSON.parse(
            storedUser
          );
        } catch{
          return null;
        }
      });

    const login = (
      jwtToken,
      userData
    ) => {

      localStorage.setItem(
        "token",
        jwtToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      setToken(jwtToken);
      setUser(userData);
    };

    const logout = () => {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      setToken(null);
      setUser(null);
    };

    return (
      <AuthContext.Provider
        value={{
          token,
          user,
          login,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
};

export const useAuth =
  () => useContext(AuthContext);