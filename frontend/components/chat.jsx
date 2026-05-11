import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Headcontext} from"../context/context"
function Chat({socket}) {
    const [currentmessage,setcurrentmessage]=useState('');
    const [chat,setchat]=useState([]);
    const [currentuser,setcurrentuser]=useState('');
    const {token,setuser}=useContext(Headcontext);   
    const[detailing,setdetailing]=useState(); 
    const navigate=useNavigate();
    useEffect(()=>{
        socket.on('connect', () => {
        console.log('socket connected! id:', socket.id);
    });
    socket.on('disconnect', (reason) => {
        console.log('socket disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
        console.log('connection error:', err.message);
    });
        const token1=localStorage.getItem('token');
        if(!token1)
        {
            navigate('/login');
        }
        console.log(token1);
       async function loadData(){
        const detail = await fetching(token1);
        if(!detail)
            {
                navigate('/login');
            }
        }
        loadData();
        
        
        socket.on('chat',(data)=>{
            console.log(data);
            setchat((prev)=>[...prev,data]);
            
        })
        
        return ()=>{
            socket.off('chat');
            socket.off('connect');
        socket.off('disconnect');
        socket.off('connect_error');
        }
        
},[]);
async function fetching(token1) {
    const res=await fetch('http://localhost:3456/chat',{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token1.trim()}`
            }
        });
        const detail=await res.json();
        if(detail.message)
        {
            navigate('/login');
        }
        setdetailing(detail);
        setuser(detail.user);
        

    console.log('socket status on mount:', socket.connected);
        console.log(detail);
        return detail;
}
   function onclick()
    {
        
        
        
        socket.emit('currentmessage',{
            message:currentmessage,
            user:detailing?.user
        });
        // setcurrentuser(detailing.user);
        setcurrentmessage('');        
    }
    return (     <div className="h-full w-full bg-black flex flex-col justify-center items-center text-black">

            <div className="h-[88%] w-[50%] bg-gray-400" >
                <ul>{
                    chat?.map(msg=>{
                        return <li>{msg.user} : {msg.message}</li>
                    })
                    }</ul>
            </div>
            <input className="bg-gray-500" type="text" value={currentmessage} onChange={e=>setcurrentmessage(e.target.value)} />
            <button className="bg-white w-[5%] h-[3%] rounded-2xl" onClick={()=>onclick()}>send</button>
            {/* <button className="bg-white w-[5%] h-[3%] rounded-2xl" onClick={()=>{navigate('/home');
                setuser(detailing.user);
            }}>home</button> */}


    </div> );
}

export default Chat;