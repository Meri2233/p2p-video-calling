
const videoEl = document.querySelector('.stream');

navigator.mediaDevices.getUserMedia({
    video: true,
}).then(stream => {
    videoEl.srcObject = stream;
    videoEl.addEventListener('loadedmetadata', () => {
        videoEl.play();
    })

    peer.on('call',(call)=>{
        call.answer(stream);
    })

    socket.on('user-add', (newPeerId) => {
        let call = peer.call(newPeerId,stream);
        call.on('stream',(remoteStream)=>{
            let newvideo = document.createElement('video');
            newvideo.srcObject = remoteStream;
            newvideo.addEventListener('loadedmetadata', () => {
                newvideo.play();
            })  
            document.body.appendChild(newvideo)
        })
        //var conn = peer.connect(newPeerId);
        // on open will be launch when you successfully connect to PeerServer   
        //conn.on('open', function () {
            // here you have conn.id
        //    conn.send('hi! from' + peer.id);
       // });
    })  
}).catch(e => console.log("Error Retrieving video"))

const socket = io("http://localhost:7001");

socket.on('connection', () => console.log("Connected to Server"));

const peer = new Peer(undefined, {
    host: "localhost",
    port: 7001,
    path: "/peerjs"
});

console.log(peer);

peer.on('open', (id) => {
    console.log("Peer ID", id)
    socket.emit('new-connection', peer.id);
})


peer.on('connection', function (conn) {
    conn.on('data', function (data) {
        // Will print 'hi!'
        console.log(data);
    });
});

