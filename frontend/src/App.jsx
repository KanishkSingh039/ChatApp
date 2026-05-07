import { Route, Routes } from "react-router-dom";
import Register from "../components/register-page";
import Login from "../components/login-page";
import Chat from "../components/chat";
import { io } from "socket.io-client";

function App() {
  const socket=io("http://localhost:3456");

  return ( 
    <div className="h-full w-full">
      <Routes>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path="/chat" element={<Chat socket={socket}/>}/>
      </Routes>
    </div>
   );
}

export default App;