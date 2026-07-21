
const call=(io,socket)=>{
    try {
    socket.on("offer", (data) => {
    // console.log("Received offer:", offer);
    socket.to(data.roomId).emit("offer-read", data.offer); // Broadcast the offer to all other connected clients
    // Here you can handle the received offer, e.g., create an answer and send it back to the client
  });
  socket.on("answer", (data) => {
    // console.log("Received answer:", answer);
    socket.to(data.roomId).emit("answer-read", data.answer); // Broadcast the answer to all other connected clients
  });
  socket.on("call-type",(data)=>{
    socket.to(data.roomId).emit("call-type-read",data.callType);
  })
  socket.on("ice-candidate", (data) => {
    // console.log("Received ICE candidate:", candidate);
    socket.to(data.roomId).emit("ice-candidate-read", data.candidate); // Broadcast the ICE candidate to all other connected clients
  });
    } catch (error) {
        return socket.emit('messagestorage',{
            message:error.message
        })
    }
}
module.exports=call