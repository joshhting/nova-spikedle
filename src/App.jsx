// src/App.jsx
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;
const MAX_ATTEMPTS = 18;

function App() {
  const [puzzle, setPuzzle] = useState(null);
  const [revealed, setRevealed] = useState("");
  const [attempts, setAttempts] = useState(MAX_ATTEMPTS);
  const [authorGuess, setAuthorGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setPuzzle(data);
        setRevealed(obscureQuote(data.quote));
      })
      .catch((err) => console.error(err));
  }, []);

  // Hide all letters at the start
  function obscureQuote(quote) {
    return quote.replace(/[A-Za-z]/g, "_");
  }

  function handleLetterGuess(letter) {
    if (gameOver || !puzzle) return;

    let newRevealed = "";
    let correctGuess = false;

    for (let i = 0; i < puzzle.quote.length; i++) {
      const ch = puzzle.quote[i];
      if (revealed[i] !== "_") {
        newRevealed += revealed[i];
      } else if (ch.toLowerCase() === letter.toLowerCase()) {
        newRevealed += ch;
        correctGuess = true;
      } else {
        newRevealed += "_";
      }
    }

    setRevealed(newRevealed);
    setAttempts((prev) => prev - 1);

    if (newRevealed === puzzle.quote) {
      setMessage("🎉 You revealed the full quote!");
      setGameOver(true);
    } else if (attempts - 1 <= 0) {
      setMessage("❌ Out of attempts. The quote was: " + puzzle.quote);
      setGameOver(true);
    }
  }

  function handleAuthorGuess() {
    if (gameOver || !puzzle) return;
    setAttempts((prev) => prev - 1);

    if (authorGuess === puzzle.author) {
      setMessage("✅ Correct author: " + puzzle.author);
      setGameOver(true);
    } else if (attempts - 1 <= 0) {
      setMessage("❌ Out of attempts. The author was: " + puzzle.author);
      setGameOver(true);
    } else {
      setMessage("Wrong author. Try again.");
    }
  }

  if (!puzzle) {
    return <div>Loading puzzle...</div>;
  }

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="app">
      <h1>Nova Quordle</h1>
      <p>Puzzle ID: {puzzle.puzzle_id}</p>
      <p className="quote">{revealed}</p>
      <p>Attempts remaining: {attempts}</p>

      <div className="letters">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterGuess(letter)}
            disabled={gameOver || !revealed.includes("_")}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="author-guess">
        <select
          value={authorGuess}
          onChange={(e) => setAuthorGuess(e.target.value)}
          disabled={gameOver}
        >
          <option value="">-- Select Author --</option>
          {puzzle.possible_authors.map((auth) => (
            <option key={auth} value={auth}>
              {auth}
            </option>
          ))}
        </select>
        <button onClick={handleAuthorGuess} disabled={gameOver || !authorGuess}>
          Guess Author
        </button>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;
