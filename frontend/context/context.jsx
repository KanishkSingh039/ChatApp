import { createContext, useState } from "react";

export const Headcontext = createContext({
  token: "",
  settoken: () => {}
});

export function Context({ children }) {
  const [token, settoken] = useState('');

  return (
    <Headcontext.Provider value={{ token, settoken }}>
      {children}
    </Headcontext.Provider>
  );
}

export default Context;