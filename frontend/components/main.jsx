import { Routes,Route, useNavigate, Outlet } from "react-router-dom";
function Main({socket}) {
    const navigate=useNavigate();
    return ( <div className="h-full w-full">
            <nav>
                <button onClick={()=>navigate('/main/chat')}>global chat</button>
                <button onClick={()=>navigate('/main/home')}>message</button>
            </nav>
        <Outlet/>

    </div> );
}

export default Main;