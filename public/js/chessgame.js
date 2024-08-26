const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerColor = null;

const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = "";
    board.forEach((row, i) => {
        row.forEach((piece, j) => {
            const square = document.createElement("div");
            square.classList.add("square", 
                (i + j) % 2 === 0 ? "light" : "dark"
            );
            square.dataset.row = i;
            square.dataset.col = j;

            if (square) {
                const pieceElement = document.createElement("div"); 
                pieceElement.classList.add("piece",
                    square.color === "w" ? "white" : "black",
                );
                pieceElement.innerHTML = getPieceUnicode(piece);
                pieceElement.draggable =  playerColor === square.color;
    
                pieceElement.addEventListener("dragstart", (e) => {
                    if (pieceElement.draggable){
                        draggedPiece = pieceElement;
                        sourceSquare = { row: i, col: j };
                        e.dataTransfer.setData("text/plain", "");
                    }
                });
                pieceElement.addEventListener("dragend", () => {
                    draggedPiece = null;
                    sourceSquare = null;
                });
    
                square.appendChild(pieceElement);
            }

            square.addEventListener("dragover", (e) => e.preventDefault());
            square.addEventListener("drop", (e) => {
                e.preventDefault();
                if (draggedPiece) {
                    const targetSquare = {
                        row: parseInt(square.dataset.row),
                        col: parseInt(square.dataset.col),
                        };
                }
            });
        });
    });
};

const handleMove = () => {};

const getPieceUnicode = () => {};