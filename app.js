const express = require('express');
const socket = require('socket.io');
const http = require('http');
const { Chess } = require('chess.js');
const path = require('path');
const { title } = require('process');
const { log } = require('console');

const app = express();

const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();

let players = {};
let currentPlayer = "w";

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index' , { title: 'Chess Game' });
});

io.on('connection', (socket) => {
    console.log('User connected: ', socket.id);

    if (!players.white) {
        players.white = socket.id;
        socket.emit('color', 'w');
    }
    else if (!players.black) {
        players.black = socket.id;
        socket.emit('color', 'b');
    }else{
        socket.emit('full', 'Game is full');
    }

    socket.on('disconnect', () => {
        if (players.white === socket.id) {
            delete players.white;
        }
        if (players.black === socket.id) {
            delete players.black;
        }
        console.log('User disconnected: ', socket.id);
    })

    socket.on('move', (move) => {
        try {
            if(chess.turn() === "w" && players.white !== socket.id){
                return;
            }
            if(chess.turn() === "b" && players.black !== socket.id){
                return;
            }
            
            const moveResult = chess.move(move);
            if (moveResult) {
                currentPlayer = chess.turn();
                io.emit('move', move);
                io.emit('boardState', chess.fen());
            }
            else {
                console.log('Invalid move : ', move);
                socket.emit('moveError', move);
            }
        } catch (error) {
            console.error(error);
            socket.emit('moveError', move);            
        }
    } )
});

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});