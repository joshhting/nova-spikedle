import QuoteDisplay from "./QuoteDisplay";
import Keyboard from "./Keyboard";
import AuthorSelector from "./AuthorSelector";
import FullQuoteGuess from "./FullQuoteGuess";
import { useNovaPuzzle } from "./usePuzzle";

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
    handleFullQuoteGuess,
    gameOver,
    feedback,
  } = useNovaPuzzle(API_URL);

  if (!puzzle) return <div>Loading puzzle...</div>;

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Nova Spikedle</h1>
      <QuoteDisplay revealed={revealed} />
      <p>Attempts left: {attemptsLeft}</p>
      <p>{message}</p>
      <Keyboard
        guessedLetters={guessedLetters}
        feedback={feedback}
        onGuess={handleLetterGuess}
      />
      <AuthorSelector
        authors={puzzle.possible_authors}
        guessedAuthors={guessedAuthors}
        onGuess={handleAuthorGuess}
      />
      <FullQuoteGuess onGuess={handleFullQuoteGuess} disabled={gameOver} />
      <p>Created by Josh Ting at <a href="https://github.com/joshhting/nova-spikedle">https://github.com/joshhting/nova-spikedle</a>.
      Please don't share this page with people outside of nova spikes, I'm too poor to support increased internet traffic</p>
    </div>
  );
}
