import { useState } from "react";
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
    authorAttemptsLeft,
    message,
    guessedLetters,
    guessedAuthors,
    handleLetterGuess,
    handleAuthorGuess,
    handleFullQuoteGuess,
    gameState,
    feedback,
    history,
    shareText,
  } = useNovaPuzzle(API_URL);

  if (!puzzle) return <div>Loading puzzle...</div>;

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Nova Spikedle</h1>
      <QuoteDisplay revealed={revealed} />
      <p>Attempts to guess quote left: {attemptsLeft}</p>
      <p>Attempts to guess author left: {authorAttemptsLeft}</p>
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
      <FullQuoteGuess onGuess={handleFullQuoteGuess} disabled={gameState} />
      {gameState === "win" && shareText && (
        <div style={{ marginTop: "1rem", border: "1px solid #ddd", padding: "1rem", borderRadius: 6 }}>
          <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{shareText}</pre>
          <CopyShareButton text={shareText} />
        </div>
      )}
      <p>Created by Josh Ting at <a href="https://github.com/joshhting/nova-spikedle">https://github.com/joshhting/nova-spikedle</a>.
      Please don't share this page with people outside of nova spikes, I'm too poor to support increased internet traffic</p>
    </div>
  );
}

function CopyShareButton({ text }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // fallback
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("copy failed", err);
    }
  };

  return (
    <div style={{ marginTop: 8 }}>
      <button onClick={copy} style={{ padding: "0.4rem 0.6rem" }}>
        {copied ? "Copied!" : "Copy share text"}
      </button>
    </div>
  );
}
