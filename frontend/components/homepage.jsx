import { useContext } from "react";
import { useEffect } from "react";
import { Headcontext } from "../context/context";
import { useState } from "react";


function Home({socket}) {
 const {user}=useContext(Headcontext);
 const[name,setname]=useState('');
 const [joinroomId,setjoinroomId]=useState('');
 const [id,setid]=useState('');
 const [room,setroom]=useState([]);

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
        socket.emit('finduser',user);
        socket.on('userid',data=>{
            
            if(data.success)
            {
                setid(data.id)
            }
        });
        
       
        return()=>{
            socket.off('roomcreated');
            socket.off('error');
            socket.off('userid')
        }
    },[]);
    useEffect(() => {

        if (id) {
            console.log("fetching rooms for:", id);
            fetchroom(id);
        }

    }, [id]);
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
    async function fetchroom(_id)
    {
        try {
            const res=await fetch('http://localhost:3456/rooms',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({
                    id:_id
                })
            });
            const detail=await res.json();
            if(!detail)
            {
                console.log("no data found from the route");
                
            }
            console.log(detail);
            
            setroom(detail.data);
            
        } catch (error) {
            return {
                problem:error.message
            }
        }
    }
    return ( <div>
        <input type="text" value={name} onChange={(e)=>setname(e.target.value)}/>
        <button onClick={()=>{
            onclick()
        }}>Direct message</button>
        <input type="text" value={joinroomId} onChange={(e)=>setjoinroomId(e.target.value)}/>
        <button onClick={()=>onjoinclick()}>join room</button>
        <ul >
        {room?.map(data=>{
            return <li key={data._id}>{data._id}</li>
        })}
        </ul>
    </div> );
}

export default Home;