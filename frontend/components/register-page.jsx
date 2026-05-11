import { useState } from "react";
import { Navigate } from "react-router-dom";

function Register() {
    const [name,setname]=useState('');
    const [email,setemail]=useState('');
    const [password,setpassword]=useState('');
    const [uniqueId,setuniqueId]=useState('');
    async function onsubmit(e){
        e.preventDefault();
       const res=await fetch("http://localhost:3456/register",{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                name,
                uniqueId,
                email,
                password
            })
        });
        const data=await res.json();
        console.log(data);
        setname('');
        setemail('');
        setpassword('');
        setuniqueId('');
        // if(data.message==="user created")
        // {
        //     Navigate('/login');
        // }
    }
    return ( 
    <div className="h-full w-full flex flex-col justify-center items-center">
        <form className="h-[40%] w-[30%]  shadow-2xl grid grid-cols-1  rounded-2xl p-4 text-center gap-" onSubmit={onsubmit}>
            <h1 className="font-bold text-3xl text-shadow-lg">Register</h1>
            <div className="h-[80%] m-0">
            <label htmlFor="Name" className="pr-3 text-gray-500 pt-2">Name :</label>
            <input className="w-[55%] pl-4 rounded-xl shadow-2xs h-[60%] text-[80%]"  placeholder="Please Enter Your Name" type="text " value={name} onChange={(e)=>setname(e.target.value)} />
            </div>
            <div className="h-[80%] m-0">
            <label htmlFor="Name" className="pr-3 text-gray-500 pt-2">UniqueId :</label>
            <input className="w-[55%] pl-4 rounded-xl shadow-2xs h-[60%] text-[80%]"  placeholder="Please Enter Your UniqueId" type="text " value={uniqueId} onChange={(e)=>setuniqueId(e.target.value)} />
            </div>

            <div className="h-[80%] m-0">
                    <label htmlFor="email" className="pr-3 text-gray-500 pt-2">Email :</label>
            <input className="w-[55%] pl-4 rounded-xl shadow-2xs h-[60%] text-[80%]" type="text" value={email} placeholder="Please Enter Your Email" onChange={(e)=>setemail(e.target.value)}/>
            </div>

            <div className="h-[80%] m-0">
                <label htmlFor="password" className="pr-3 text-gray-500 pt-2">Password :</label>
            <input className="w-[55%] pl-4 rounded-xl shadow-2xs h-[60%] text-[80%]" placeholder="Please Enter Your Password" type="password" value={password} onChange={(e)=>setpassword(e.target.value)}/>
            </div>

            <button type="submit" className="w-[30%] h-[50%] rounded-2xl bg-black text-white ml-[33%] hover:cursor-pointer">Submit</button>
        </form>
    </div> 
    );
}

export default Register;