import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Square } from "./components/square";
import { TURNS } from "./constant";
import { checkWinner, checkEndGame, makeComputerMove } from "./assets/logic/board";
import { WinnerModal } from "./components/WinnerModal";

const INITIAL_BOARD = Array(9).fill(null);

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = JSON.parse(window.localStorage.getItem("board"));
    return boardFromStorage || INITIAL_BOARD;
  });

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn");
    return turnFromStorage || TURNS.x;
  });

  const [winner, setWinner] = useState(null);
  const [isAgainstComputer, setIsAgainstComputer] = useState(true);

  useEffect(() => {
    if (isAgainstComputer && turn === TURNS.o && !winner) {
      const delay = Math.random() * 1500 + 500;
      const computerMoveTimer = setTimeout(() => {
        const newBoard = makeComputerMove([...board], TURNS.o);
        setBoard(newBoard);
        setTurn(TURNS.x);
        const newWinner = checkWinner(newBoard);
        if (newWinner) {
          confetti();
          setWinner(newWinner);
        } else if (checkEndGame(newBoard)) {
          setWinner(false);
        }
      }, delay);

      return () => clearTimeout(computerMoveTimer);
    }
  }, [board, turn, winner, isAgainstComputer]);

  const updateBoard = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    setTurn(turn === TURNS.x ? TURNS.o : TURNS.x);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  };

  const resetGame = () => {
    setBoard(INITIAL_BOARD);
    setTurn(TURNS.x);
    setWinner(null);

    window.localStorage.removeItem("board");
    window.localStorage.removeItem("turn");
  };

  const toggleGameMode = () => {
    setIsAgainstComputer((prev) => !prev);
    resetGame();
  };

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
        {board.map((value, index) => (
          <Square key={index} index={index} updateBoard={updateBoard}>
            {value}
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