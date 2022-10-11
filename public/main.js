
const videoEl = document.querySelector('.stream');
const startEl = document.querySelector('.start');
const joinEl = document.querySelector('.join');
const roomCodeEl = document.querySelector('.roomcode');
const enterEl = document.querySelector('.enter');
const code = document.querySelector("#code");

const socket = io("http://localhost:7000");
socket.on('connection', () => console.log("Connected to Server"));

const peer = new Peer(undefined, {
    host: "localhost",
    port: 7000,
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
            newvideo.classList.add('stream');
            newvideo.srcObject = remoteStream;
            newvideo.addEventListener('loadedmetadata', () => {
                newvideo.play();
            })
            document.querySelector('.videosection').appendChild(newvideo)
        })
    })

    
    socket.on('user-add', (newPeerId) => {
        let call = peer.call(newPeerId, stream);
        call.on('stream', (remoteStream) => {
            console.log("Stream Received")
            let newvideo = document.createElement('video');
            newvideo.classList.add('stream');
            newvideo.srcObject = remoteStream;
            newvideo.addEventListener('loadedmetadata', () => {
                newvideo.play();
            })
            document.querySelector('.videosection').appendChild(newvideo)
        })
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

