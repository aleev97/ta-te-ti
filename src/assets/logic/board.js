import { WINNER_COMBOS } from "../../constant";

// Función para comprobar si hay un ganador
export const checkWinner = (boardToCheck, player) => {
  for (const combo of WINNER_COMBOS) {
    const [a, b, c] = combo;
    if (boardToCheck[a] && boardToCheck[a] === boardToCheck[b] && boardToCheck[a] === boardToCheck[c]) {
      return boardToCheck[a];
    }
  }
  return null;
};

// Función para comprobar si el juego ha terminado en empate
export const checkEndGame = (newBoard) => newBoard.every((square) => square !== null);

// Función para que la computadora realice su movimiento
export const makeComputerMove = (board) => {
  // Buscar un espacio vacío en el tablero
  const emptyIndices = board.reduce((indices, square, index) => {
    if (square === null) {
      indices.push(index);
    }
    return indices;
  }, []);

  // Elegir un índice al azar de los espacios vacíos
  const randomIndex = Math.floor(Math.random() * emptyIndices.length);

  // Realizar el movimiento de la computadora en el tablero
  const computerMoveIndex = emptyIndices[randomIndex];
  board[computerMoveIndex] = '🟢';

  return board;
};
