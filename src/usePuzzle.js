import { useEffect, useState } from "react";

const MAX_ATTEMPTS = 20;

export function useNovaPuzzle(apiUrl) {
  const [puzzle, setPuzzle] = useState(null);
  const [revealed, setRevealed] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [guessedAuthors, setGuessedAuthors] = useState(new Set());
  const [message, setMessage] = useState("");

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
        setAttemptsLeft(data.attempts_allowed);
        setRevealed(maskQuote(data.quote));
      } catch (err) {
        console.error(err);
      }
    }
    fetchPuzzle();
  }, [apiUrl]);

  const handleLetterGuess = (letter) => {
    if (!puzzle || attemptsLeft <= 0 || guessedLetters.has(letter)) return;

    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    const updatedRevealed = maskQuote(puzzle.quote, newGuessed);
    setRevealed(updatedRevealed);
    setAttemptsLeft(attemptsLeft - 1);
    setMessage(
      updatedRevealed.includes(letter)
        ? `Good guess: "${letter}"`
        : `No "${letter}" found`
    );
  };

  const handleAuthorGuess = (author) => {
    if (!puzzle || attemptsLeft <= 0 || guessedAuthors.has(author)) return;
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

  return {
    puzzle,
    revealed,
    attemptsLeft,
    message,
    guessedLetters,
    guessedAuthors,
    handleLetterGuess,
    handleAuthorGuess,
  };
}
