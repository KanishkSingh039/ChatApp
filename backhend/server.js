require('dotenv').config();
const express=require('express');
const http=require('http');
const {Server}=require('socket.io');
const cor=require('cors');
const connecting=require('./database_config/database');
const register_login=require('./routes/register-login');
const chat=require('./routes/chat');
const room=require('./routes/room');
const message=require('./routes/message');
const socketsetup = require('./socket/socket');
const app=express();
connecting();
app.use(cor(
    {
        origin:"http://localhost:5173",
        methods:["GET","POST"]
    }
));
app.use(express.json());
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"]
    }
});
socketsetup(io);
app.use(register_login);
app.use(chat);
app.use(room);
app.use(message);
server.listen(process.env.PORT,()=>{
    console.log("server started");
})