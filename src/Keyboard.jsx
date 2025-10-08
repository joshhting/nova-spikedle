export default function Keyboard({ guessedLetters, onGuess }) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return (
      <div style={{ marginTop: "1rem" }}>
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => onGuess(letter)}
            disabled={guessedLetters.has(letter)}
            style={{
              margin: "0.25rem",
              padding: "0.5rem",
              backgroundColor: guessedLetters.has(letter) ? "#ccc" : "#eee",
              color: guessedLetters.has(letter) ? "#666" : "#000",
              cursor: guessedLetters.has(letter) ? "not-allowed" : "pointer",
            }}
          >
            {letter}
          </button>
        ))}
      </div>
    );
  }
  