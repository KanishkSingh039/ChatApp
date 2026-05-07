import { useContext } from "react";
import { useEffect } from "react";
import { Headcontext } from "../context/context";
import { useState } from "react";


function Home({socket}) {
 const {user}=useContext(Headcontext);
 const[name,setname]=useState('');
 const [joinroomId,setjoinroomId]=useState('');

    useEffect(()=>{
        socket.on('roomcreated',(data)=>{
            console.log('roomcreated',data);
            
        });
        socket.on('error',data=>{
            console.log(data);}
            
        );
        socket.on('joinroom-response',data=>{
            console.log(data);
            
        });

        return()=>{
            socket.off('createdroom');
            socket.off('error');
        }
    })
    function onclick() {
        socket.emit('createroom',{
            user,
            name
        })
        
    }
    function onjoinclick()
    {
        socket.emit('joinroom',{joinroomId,
            user
        });
    }
    return ( <div>
        <input type="text" value={name} onChange={(e)=>setname(e.target.value)}/>
        <button onClick={()=>{
            onclick()
        }}>Direct message</button>
        <input type="text" value={joinroomId} onChange={(e)=>setjoinroomId(e.target.value)}/>
        <button onClick={()=>onjoinclick()}>join room</button>
        <div >

        </div>
    </div> );
}

export default Home;