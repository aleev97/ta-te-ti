import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Square } from "./components/square";
import { TURNS } from "./constant";
import { checkWinner, checkEndGame, makeComputerMove } from "./assets/logic/board";
import { WinnerModal } from "./components/WinnerModal";

function App() {
  // Estados
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board");
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null);
  });

  const [turn, setTurn] = useState(() => {
    const turnFormStorage = window.localStorage.getItem("turn");
    return turnFormStorage ?? TURNS.x;
  });

  const [winner, setWinner] = useState(null); // null(no hay ganador); false(empate)
  const [isAgainstComputer, setIsAgainstComputer] = useState(true); // Nuevo estado para indicar si se juega contra la computadora o no

  // Efecto para el turno de la computadora
  useEffect(() => {
    if (isAgainstComputer && turn === TURNS.o && !winner) {
      // Es el turno de la computadora (O) y no hay ganador
      const delay = Math.random() * 1500 + 500; // Agrega un pequeño retraso para que la jugada de la computadora sea más natural
      const computerMoveTimer = setTimeout(() => {
        const newBoard = makeComputerMove([...board], TURNS.o); // TURNS.o representa la computadora
        setBoard(newBoard);

        // Cambiar el turno
        setTurn(TURNS.x);

        // Revisar si hay ganador
        const newWinner = checkWinner(newBoard);
        if (newWinner) {
          confetti();
          setWinner(newWinner);
        } else if (checkEndGame(newBoard)) {
          setWinner(false); // Empate
        }
      }, delay);

      return () => clearTimeout(computerMoveTimer); // Limpiar el temporizador si el componente se desmonta antes de que se ejecute la jugada de la computadora
    }
  }, [board, turn, winner, isAgainstComputer]);

  // Función para manejar el clic en una casilla
  const updateBoard = (index) => {
    if (board[index] || winner) return; // Si la casilla está llena o hay un ganador, no hacer nada

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    // Cambiar el turno
    setTurn(turn === TURNS.x ? TURNS.o : TURNS.x);

    // Revisar si hay ganador
    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false); // Empate
    }
  };

  // Función para reiniciar el juego
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.x);
    setWinner(null);

    window.localStorage.removeItem("board");
    window.localStorage.removeItem("turn");
  };

  // Función para cambiar el modo del juego
  const toggleGameMode = () => {
    setIsAgainstComputer((prev) => !prev);
    resetGame(); // Reiniciar el juego cuando se cambie el modo
  };

  // Guardar el estado del tablero y el turno en localStorage
  useEffect(() => {
    window.localStorage.setItem("board", JSON.stringify(board));
    window.localStorage.setItem("turn", turn);
  }, [board, turn]);

  return (
    <main className="board">
      <h1>TA TE TI</h1>
      <button onClick={resetGame}>Reiniciar partida</button>
      <button onClick={toggleGameMode}>
        {isAgainstComputer ? "Jugar contra un amigo" : "Jugar contra IA"}
      </button>

      <section className="game">
        {board.map((_, index) => (
          <Square key={index} index={index} updateBoard={updateBoard}>
            {board[index]}
          </Square>
        ))}
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.x}>{TURNS.x}</Square>
        <Square isSelected={turn === TURNS.o}>{TURNS.o}</Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  );
}

export default App;