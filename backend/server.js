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
const request=require('./routes/request');
const imageuploader=require('./routes/imageuploader');
const socketsetup = require('./socket/socket');
const app=express();
connecting();

app.use(express.urlencoded({
    extended: true,
    limit: "50mb"
}));
app.use(cor(
    {
        origin:"https://speakify-pg3w.onrender.com",
        methods:["GET","POST"]
    }
));
app.use(express.json({
    limit: "50mb"
}));
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"https://speakify-pg3w.onrender.com",
        methods:["GET","POST"]
    }
});
socketsetup(io);
app.use(register_login);
app.use(chat);
app.use(room);
app.use(message);
app.use(request);
app.use(imageuploader);
server.listen(process.env.PORT,()=>{
    console.log("server started");
})