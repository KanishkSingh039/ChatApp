import { createContext, useState } from "react";

export const Headcontext = createContext({
  token: "",
  settoken: () => {}
});

export function Context({ children }) {
  const [token, settoken] = useState('');
  const [user,setuser]=useState('');

  return (
    <Headcontext.Provider value={{ token, settoken,user,setuser }}>
      {children}
    </Headcontext.Provider>
  );
}

export default Context;