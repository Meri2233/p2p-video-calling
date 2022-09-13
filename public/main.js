
const videoEl = document.querySelector('.stream');
const socket = io("http://localhost:7001");
socket.on('connection', () => console.log("Connected to Server"));

const peer = new Peer(undefined, {
    host: "localhost",
    port: 7001,
    path: "/peerjs"
})
console.log(peer);


navigator.mediaDevices.getUserMedia({
    video: true,
}).then(stream => {
    videoEl.srcObject = stream;
    videoEl.addEventListener('loadedmetadata', () => {
        videoEl.play();
    })

    peer.on('call', (call) => {
        console.log("Call Received");
        call.answer(stream);
        call.on('stream', (remoteStream) => {
            console.log("Stream Received")
            let newvideo = document.createElement('video');
            newvideo.srcObject = remoteStream;
            newvideo.addEventListener('loadedmetadata', () => {
                newvideo.play();
            })
            document.body.appendChild(newvideo)
        })
    })

    
    socket.on('user-add', (newPeerId) => {
        let call = peer.call(newPeerId, stream);
        call.on('stream', (remoteStream) => {
            console.log("Stream Received")
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



peer.on('open', (id) => {
    console.log("Peer ID", id)
    setTimeout(() => {
        socket.emit('new-connection', peer.id);
    }, 500)
})


peer.on('connection', function (conn) {
    conn.on('data', function (data) {
        console.log(data);
    });
});

