const express = require('express')
const {Server} = require('socket.io');
const { ExpressPeerServer } = require('peer');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.static('public'));    
app.set('view engine','ejs')

app.get('/',(req,res)=>{
    res.render('index');
})
const httpServer = app.listen(7001 || process.env.PORT);

const peerServer = ExpressPeerServer(httpServer, {  
    debug: true,
});

app.use('/peerjs', peerServer);

peerServer.on('connection', (client) => {
    console.log("Server: Peer connected with ID:", client.id);
});

peerServer.on('disconnect', (client) => {
    console.log("Server: Peer disconnected with ID:", client.id);
});

const io = new Server(httpServer,{
    cors:{
        origin:"*"
    }
});

io.on('connection',(socket)=>{
    console.log(`New Client Connected: ${socket.id}`);
    socket.on('new-connection',(peerId)=>{
        console.log("New Connection request")
        socket.broadcast.emit('user-add',peerId);     
    }) 
})