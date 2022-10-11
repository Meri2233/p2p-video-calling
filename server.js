const express = require('express')
const { Server } = require('socket.io');
const { ExpressPeerServer } = require('peer');
const cors = require('cors');

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}

const app = express();

app.use(cors(corsOptions));

app.use(express.static('public'));
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index');
})

const httpServer = app.listen(7000 || process.env.PORT,()=>{
    console.log("Server Running")
});

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

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`New Client Connected: ${socket.id}`);
    socket.on('new-connection',(peerId)=>{
        console.log("New Connection request")
        socket.broadcast.emit('user-add',peerId);     
    })
    socket.on('call-user', (roomId) => {
        io.to(roomId).emit("anwer-call")
    })
    socket.on('answer-call', (data) => {
        io.to(data.to).emit('call-received', data.signal)
    })
    socket.on('disconnect', () => {
        console.log("Client Disconnected")
    })
})