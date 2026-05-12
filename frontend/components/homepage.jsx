import { useContext } from "react";
import { useEffect } from "react";
import { Headcontext } from "../context/context";
import { useState } from "react";


function Home({socket}) {
 const {user}=useContext(Headcontext);
 const[name,setname]=useState('');
 const [joinroomId,setjoinroomId]=useState('');
 const [findfriend,setfindfriend]=useState('');
 const[friend,setfriend]=useState('');
 const [id,setid]=useState('');
 const [room,setroom]=useState([]);
 const [message,setmessage]=useState('');
 const [currentroomId,setcurrentroomId]=useState('');
 const[allroomcontent,setallroomcontent]=useState([]);

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
        socket.on('friendfinded',(data)=>{
            console.log(data);
            setfriend(data.friend);
        })
        socket.on('roomcreatedwithfriend',(data)=>{
            console.log(data);
            
        })
        socket.on('messagestorage',(data)=>{
            console.log(data);
            console.log(allroomcontent);
            
        })
       
        return()=>{
            socket.off('roomcreated');
            socket.off('error');
            socket.off('userid')
            socket.off('friendfinded');
            socket.off('roomcreatedwithfriend')
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
    function onfindfriend(){
        socket.emit('findfriend',{
            uniqueId:findfriend
        })
    }
    function addfriend() {
        socket.emit('createroomwiththefriend',{
            id,
            friend
        })
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
    function sendmessage()
    {
        socket.emit('sendmessage',{
            roomId:currentroomId,
            senderId:id,
            content:message
        });
        setmessage('');
        // socket.emit('requestcontent',setallroomcontent);
        // const data =await fetch('')
    }
    async function messagebox(_id)
    {
        setcurrentroomId(_id);
        const oldmessages=await fetch('http://localhost:3456/message',{
            method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({
                    roomId:_id
                })
            });
            const data = await oldmessages.json();

    console.log(data.content);

        setallroomcontent(prev=>[...prev,data.content]);
    }
    return ( <div className="h-full w-full bg-black text-white overflow-scroll relative">
        <div className="flex bg-gray-900 w-[80%]] flex-row gap-5 justify-center items-center rounded-2xl m-4 mt-0 h-[20%] ">
        <input className="text-white bg-gray-700 h-8 rounded-xl w-[20%] pl-5" placeholder="Enter the name for the group" type="text" value={name} onChange={(e)=>setname(e.target.value)}/>
        <button className='bg-white text-black px-3 rounded-2xl h-6'  onClick={()=>{
            onclick()
        }}> CreateGroup</button>
        <input className="text-white bg-gray-700 h-8 rounded-xl w-[15%] pl-5" placeholder="Enter the group Id" type="text" value={joinroomId} onChange={(e)=>setjoinroomId(e.target.value)}/>
        <button className='bg-white text-black px-3 rounded-2xl h-6'  onClick={()=>onjoinclick()}>JoinRoom</button>
        <div className=" flex flex-row justify-between pr-2 items-center text-white bg-gray-700 h-8 rounded-xl w-[20%]">
        <input className=" pl-5" placeholder="Enter the friend's uniqueId" type="text" value={findfriend} onChange={(e)=>setfindfriend(e.target.value)}/>
        <button  className='bg-inherit text-white px-3 rounded-4xl h-[70%] w-[12%] text-center' onClick={()=>{
            addfriend()
        }}>+</button>

        </div>
        <button className='bg-white text-black px-3 rounded-2xl h-6'  onClick={()=>onfindfriend()}>Search</button>

        </div>
        <div className="flex flex-row h-screen">
        <ul className="flex flex-col  items-center h-[70%]">
        {room?.map(data=>{
            return <li className="w-full overflow-hidden h-[10%] shadow-2xl  bg-gray-800 px-5 py-3" onClick={()=>{
                messagebox(data._id)
            }} key={data._id}>{data.name}</li>
        })}
        </ul>
        <div className="w-full   bg-gray-600">
            {
                console.log(allroomcontent)
            }
            {
                
                
                allroomcontent?.map(data=>{
                    console.log(data);
                    
                    return <div key={data._id}>{data.content}</div>
                })
            }
        <div className="fixed bottom-3 w-[60%] h-[8%] rounded-3xl pr-5 bg-gray-800 left-[30%] pl-5 flex flex-row justify-between items-center "> 
            <input className="w-[80%] h-[90%]" value={message} onChange={(e)=>setmessage(e.target.value)} placeholder="Enter message" type="text" /> 
            <button className="h-[80%] w-[8%] rounded-4xl bg-white text-black" onClick={()=>sendmessage()}>Send</button></div>
        </div>
        </div>
        
    </div> );
}

export default Home;