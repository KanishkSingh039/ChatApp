import { Routes,Route, useNavigate, Outlet } from "react-router-dom";
function Main({socket}) {
    const navigate=useNavigate();
    return ( <div className="h-full w-full">
            <nav className="z-10 bg-black text-white h-[5%] flex flex-row gap-2 items-center">
                <button onClick={()=>navigate('/main/chat')}>GlobalChat</button>
                <button onClick={()=>navigate('/main/home')}>Message</button>
            </nav>
        <Outlet/>

    </div> );
}

export default Main;