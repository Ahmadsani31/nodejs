const express = require('express'); 
const app = express();
const server = require("http").createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let userConn = 0;
  io.on('connection', (socket) => {
    ++userConn;
    console.log('user yang con '+ userConn);
    socket.broadcast.emit("sendNotif", JSON.stringify({type: 'conn',pesan:'a user connected, SocketID '+socket.id}));
    socket.on("sendNotif", (message)=>{
        console.log(message);
        socket.broadcast.emit("sendNotif",message)
        socket.emit("sendNotif",message)
    })
    socket.on('disconnect', () => {
      --userConn;
      console.log('user yang discon '+ userConn);

        var connectionMessage = " Disconnected from Socket " + socket.id;
        socket.broadcast.emit("sendNotif", JSON.stringify({type: 'discon',pesan:connectionMessage}));
        console.log(connectionMessage);
      });
  });
  
  server.listen(PORT, () => {
    console.log('listening on *' +PORT);
  });