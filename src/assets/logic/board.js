import { WINNER_COMBOS } from "../../constant";

// Función para comprobar si hay un ganador
export const checkWinner = (boardToCheck, player) => {
  // revisar combinaciones ganadoras
  for (const combo of WINNER_COMBOS) {
    const [a, b, c] = combo;
    if (
      boardToCheck[a] &&
      boardToCheck[a] === boardToCheck[b] &&
      boardToCheck[a] === boardToCheck[c]
    ) {
      return boardToCheck[a];
    }
  }

  return null;
};

// Función para comprobar si el juego ha terminado en empate
export const checkEndGame = (newBoard) => {
  // reviso si hay empate
  // reviso si no hay espacios vacios en el tablero
  return newBoard.every((Square) => Square !== null);
};

// Función para que la computadora realice su movimiento
export const makeComputerMove = (board) => {
    // Buscar un espacio vacío en el tablero
    const emptyIndices = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        emptyIndices.push(i);
      }
    }
  
    // Elegir un índice al azar de los espacios vacíos
    const randomIndex = Math.floor(Math.random() * emptyIndices.length);
  
    // Realizar el movimiento de la computadora en el tablero
    const computerMoveIndex = emptyIndices[randomIndex];
    board[computerMoveIndex] = '🟢'; 
  
    return board;
  };