import React, { useState, useEffect, useContext } from "react";

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth0 = async () => {
      const isAuthenticated = await checkSession();
      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await getUser();
        setUser(user);
      }

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  async function checkSession() {
    try {
      const response = await fetch(`/session`, {});
      const responseData = await response.json();
      return responseData.session;
    } catch (error) {
      console.error(error);
    }
  }

  async function getUser() {
    try {
      const response = await fetch(`/userinfo`, {});
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
    }
  }

  function loginWithRedirect() {
    window.location.href = "/login";
  }

  function logoutWithRedirect() {
    window.location.href = "/logout";
  }

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        loginWithRedirect: (...p) => loginWithRedirect(...p),
        logout: (...p) => logoutWithRedirect(...p)
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
