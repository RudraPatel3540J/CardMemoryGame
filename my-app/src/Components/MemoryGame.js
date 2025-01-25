import { useEffect, useState } from "react";
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const imageLinks = [
  "https://picsum.photos/200?random=1",
  "https://picsum.photos/200?random=2",
  "https://picsum.photos/200?random=3",
  "https://picsum.photos/200?random=4",
  "https://picsum.photos/200?random=5",
  "https://picsum.photos/200?random=6",
  "https://picsum.photos/200?random=7",
  "https://picsum.photos/200?random=8",
  "https://picsum.photos/200?random=9",
  "https://picsum.photos/200?random=10",
];
const MemoryGame = () => {
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const shuffledBoard = shuffleArray([...imageLinks, ...imageLinks]).map(
      (img, index) => ({
        id: index,
        img,
        revealed: false,
      })
    );
    setBoard(shuffledBoard);
  }, []);

  const handleTileClick = (id) => {
    if (selected.length === 2 || matched.includes(id)) return;

    const newSelected = [...selected, id];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [firstId, secondId] = newSelected;
      if (board[firstId].img === board[secondId].img) {
        setMatched([...matched, firstId, secondId]);
        setScores((prev) => ({
          ...prev,
          [`player${currentPlayer}`]: prev[`player${currentPlayer}`] + 1,
        }));
      } else {
        setTimeout(() => {
          setBoard((prevBoard) =>
            prevBoard.map((tile, idx) =>
              newSelected.includes(idx) ? { ...tile, revealed: false } : tile
            )
          );
        }, 1000);
        setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
      }
      setTimeout(() => setSelected([]), 1000);
    }

    setBoard((prevBoard) =>
      prevBoard.map((tile, idx) =>
        idx === id ? { ...tile, revealed: true } : tile
      )
    );
  };

  useEffect(() => {
    if (matched.length === board.length && board.length > 0) {
      setGameOver(true);
    }
  }, [matched]);

  const resetGame = () => {
    const shuffledBoard = shuffleArray([...imageLinks, ...imageLinks]).map(
      (img, index) => ({
        id: index,
        img,
        revealed: false,
      })
    );
    setBoard(shuffledBoard);
    setSelected([]);
    setMatched([]);
    setScores({ player1: 0, player2: 0 });
    setCurrentPlayer(1);
    setGameOver(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Memory Matching Game</h1>
      <div className="mb-4">
        <p>Player 1 Score: {scores.player1}</p>
        <p>Player 2 Score: {scores.player2}</p>
        <p>Current Player: Player {currentPlayer}</p>
      </div>
      <div className="grid grid-cols-6 gap-4 mb-4">
        {board.map((tile, idx) => (
          <div
            key={tile.id}
            className={`w-20 h-20 flex items-center justify-center border rounded ${
              tile.revealed || matched.includes(idx)
                ? "bg-blue-200"
                : "bg-gray-300"
            }`}
            onClick={() => handleTileClick(idx)}
          >
            {tile.revealed || matched.includes(idx) ? (
              <img
                src={tile.img}
                alt={`Tile ${idx}`}
                className="w-full h-full object-cover"
              />
            ) : (
              "?"
            )}
          </div>
        ))}
      </div>
      {gameOver && <p className="text-green-500 mb-4">Game Over! 🎉</p>}
      <button
        onClick={resetGame}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Reset Game
      </button>
    </div>
  );
};

export default MemoryGame;
