export default function Keyboard({ guessedLetters, feedback, onGuess }) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div
      style={{
        marginTop: "1rem",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(40px, 1fr))",
        gap: "0.25rem",
        maxWidth: "600px",
        marginInline: "auto",
      }}
    >
      {alphabet.map((letter) => {
        const isGuessed = guessedLetters.has(letter);
        const feedbackType = feedback[letter];

        let backgroundColor = "#eee";
        let color = "#000";

        if (feedbackType === "correct") {
          backgroundColor = "#6aaa64"; // green
          color = "white";
        } else if (feedbackType === "wrong") {
          backgroundColor = "#c94f4f"; // red
          color = "white";
        } else if (isGuessed) {
          backgroundColor = "#ccc"; // fallback
          color = "#666";
        }

        return (
          <button
            key={letter}
            onClick={() => onGuess(letter)}
            disabled={isGuessed}
            style={{
              padding: "0.6rem",
              fontSize: "1rem",
              border: "none",
              borderRadius: "6px",
              backgroundColor,
              color,
              cursor: isGuessed ? "not-allowed" : "pointer",
              transition: "background-color 0.2s ease, color 0.2s ease",
            }}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
