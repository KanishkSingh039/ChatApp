import { useContext, useState } from "react";
import {Headcontext} from "../context/context";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email,setemail]=useState('');
    const [password,setpassword]=useState('');
    const navigate=useNavigate();
    const {settoken}=useContext(Headcontext)
    async function onsubmit(e){
        e.preventDefault();
       const res=await fetch("http://localhost:3456/login",{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                email,
                password
            })
        });
        if(!res.ok)
        {
            console.log(res.message);
            
        }
        console.log(res);
        
        const data=await res.json();
        console.log(data);
        setemail('');
        setpassword('');
        if (data.token) {
            localStorage.setItem('token',data.token);
            settoken(data.token);
            navigate("/main/chat");
            } else {
            console.log("Login failed:", data.message);
            }
    }
    return ( 
    <div className="h-full w-full flex flex-col justify-center items-center">
        <form className="h-[40%] w-[30%]  shadow-2xl grid grid-cols-1  rounded-2xl p-4 text-center gap-" onSubmit={onsubmit}>
            <h1 className="font-bold text-3xl text-shadow-lg">Login</h1>

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

export default Login;