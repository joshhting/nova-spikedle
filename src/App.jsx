import QuoteDisplay from "./components/QuoteDisplay";
import Keyboard from "./components/Keyboard";
import AuthorSelector from "./components/AuthorSelector";
import { useNovaPuzzle } from "./hooks/usePuzzle";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const {
    puzzle,
    revealed,
    attemptsLeft,
    message,
    guessedLetters,
    guessedAuthors,
    handleLetterGuess,
    handleAuthorGuess,
  } = useNovaPuzzle(API_URL);

  if (!puzzle) return <div>Loading puzzle...</div>;

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Nova Quordle</h1>
      <QuoteDisplay revealed={revealed} />
      <p>Attempts left: {attemptsLeft}</p>
      <p>{message}</p>
      <Keyboard guessedLetters={guessedLetters} onGuess={handleLetterGuess} />
      <AuthorSelector
        authors={puzzle.possible_authors}
        guessedAuthors={guessedAuthors}
        onGuess={handleAuthorGuess}
      />
    </div>
  );
}
