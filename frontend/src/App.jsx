import { Route, Routes } from "react-router-dom";
import Register from "../components/register-page";
import Login from "../components/login-page";
import Chat from "../components/chat";
import { io } from "socket.io-client";
import Main from "../components/main";
import Home from "../components/homepage";


function App() {
  const socket=io("http://localhost:3456");

  return ( 
    <div className="h-full w-full">
      <Routes>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        {/* <Route path="/chat" element={<Chat socket={socket}/>}/>
        <Route path='/home' element={<Home socket={socket}/>}/> */}
        <Route path="/main" element={<Main/>}>
          <Route path="chat" element={<Chat socket={socket}/>}/>
        <Route path='home' element={<Home socket={socket}/>}/>
        </Route>
      </Routes>
    </div>
   );
}

export default App;