import { useEffect, useState } from "react";

const MAX_ATTEMPTS = 15;

export function useNovaPuzzle(apiUrl) {
  const [puzzle, setPuzzle] = useState(null);
  const [revealed, setRevealed] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [guessedAuthors, setGuessedAuthors] = useState(new Set());
  const [message, setMessage] = useState("");
  const [gameState, setGameState] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [history, setHistory] = useState([]);
  const [shareText, setShareText] = useState("");

  // When the gameState becomes 'loss', reveal the full quote and author
  useEffect(() => {
    if (gameState === "loss" && puzzle) {
      setRevealed(puzzle.quote);
      setMessage(`💀 You lost — the quote was "${puzzle.quote}" by ${puzzle.author}`);
    }
  }, [gameState, puzzle]);

  // When the player wins, build a shareable text block
  useEffect(() => {
    if (gameState === "win" && puzzle) {
      const guesses = history.length;
      const symbols = history.map((h) => (h ? "✅" : "❌")).join(" ");
      const link = typeof window !== "undefined" ? window.location.href : apiUrl || "";
      const share = `I completed the nova-spikedle in ${guesses} guesses!` + "\n" +
        symbols + "\n" +
        `Play here: ${link}`;
      setShareText(share);
    }
  }, [gameState, puzzle, history, apiUrl]);

  const maskQuote = (quote, guesses = new Set()) =>
    quote
      .split("")
      .map((ch) =>
        /[a-zA-Z]/.test(ch)
          ? guesses.has(ch.toUpperCase()) || guesses.has(ch.toLowerCase())
            ? ch
            : "_"
          : ch
      )
      .join("");

  useEffect(() => {
    async function fetchPuzzle() {
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        setPuzzle(data);
        setRevealed(maskQuote(data.quote));
      } catch (err) {
        console.error(err);
      }
    }
    fetchPuzzle();
  }, [apiUrl]);

  const handleLetterGuess = (letter) => {
    if (!puzzle || gameState || attemptsLeft <= 0 || guessedLetters.has(letter)) return;

    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    const updatedRevealed = maskQuote(puzzle.quote, newGuessed);
    setRevealed(updatedRevealed);
    setAttemptsLeft(attemptsLeft - 1);
    const found = puzzle.quote.toLowerCase().includes(letter.toLowerCase());

    setHistory((prev) => [...prev, found]);

    setFeedback((prev) => ({
      ...prev,
      [letter]: found ? "correct" : "wrong",
    }));

    if (updatedRevealed === puzzle.quote) {
      setMessage(`🎉 You revealed the entire quote!`);
      setGameState("win");
    } else {
      setMessage(
        found ? `Good guess: "${letter}"` : `No "${letter}" found`
      );
      if (attemptsLeft == 0) {
        setGameState("loss");
      }
    }
  };

  const handleAuthorGuess = (author) => {
    if (!puzzle || gameState || attemptsLeft <= 0 || guessedAuthors.has(author)) return;
    const newGuessed = new Set(guessedAuthors);
    newGuessed.add(author);
    setGuessedAuthors(newGuessed);
    setAttemptsLeft(attemptsLeft - 1);
    setMessage(
      author === puzzle.author
        ? `🎉 Correct! The quote is by ${author}.`
        : `❌ ${author} is not correct.`
    );
  };

  const handleFullQuoteGuess = (guess) => {
    if (!puzzle || gameState || attemptsLeft <= 0) return;

    setAttemptsLeft((prev) => prev - 1);

    if (guess.trim().toLowerCase() === puzzle.quote.trim().toLowerCase()) {
      setRevealed(puzzle.quote);
      setHistory((prev) => [...prev, true]);
      setMessage("🎯 Perfect! You guessed the entire quote!");
      setGameState("win");
    } else {
      setHistory((prev) => [...prev, false]);
      setMessage("❌ Quote is incorrect. Be sure to check nonalphabetic characters as well.");
      if (attemptsLeft == 0) {
        setGameState("loss");
      }
    }
  };

  return {
    puzzle,
    revealed,
    attemptsLeft,
    message,
    guessedLetters,
    guessedAuthors,
    handleLetterGuess,
    handleAuthorGuess,
    handleFullQuoteGuess,
    gameState,
    feedback,
    history,
    shareText
  };
}
