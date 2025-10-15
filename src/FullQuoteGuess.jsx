import { useState } from "react";

export default function FullQuoteGuess({ onGuess, disabled }) {
  const [guess, setGuess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guess.trim()) return;
    onGuess(guess);
    setGuess(""); // clear field after attempt
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginTop: "2rem", textAlign: "center" }}
    >
      <input
        type="text"
        placeholder="Enter full quote"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        disabled={disabled}
        style={{
          width: "80%",
          padding: "0.5rem",
          fontSize: "1rem",
          marginRight: "0.5rem",
        }}
      />
      <button
        type="submit"
        disabled={disabled}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        Guess Quote
      </button>
    </form>
  );
}
