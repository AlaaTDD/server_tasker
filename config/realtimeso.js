const { v4: uuidv4 } = require('uuid');

const RealTimeDB=(app,io)=>{
 var clints={}; 
io.on('connection', (socket) => {
      console.log(socket.id);
      socket.on('signin',(id)=>{
        clints[id]=socket;
        console.log(clints);
      });
      socket.on('joinRoom', (roomName) => {
        socket.join(roomName);
        console.log(roomName);
      });
      socket.on('like', (roomName) => {
        io.to(roomName).emit('like', `like ${socket.id} joined the room`);
      });
      socket.on('communt', (roomName) => {
        io.to(roomName).emit('like', `communt ${socket.id} joined the room`);
      });
      socket.on('disconnect',(data)=>{
        console.log(data.id);
      });
      socket.on('message',(data)=>{
        console.log(data);
       if(clints[data.id])
       clints[data.id].emit("message",data);
       if(clints[data.reveiver])
       clints[data.reveiver].emit("message",data);
      });
    
});
}

module.exports = {RealTimeDB};