export default function QuoteDisplay({ revealed }) {
    return (
      <p
        style={{
          fontSize: "1.5rem",
          letterSpacing: "0.3rem",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {revealed.split("").map((ch, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              width: ch === " " ? "1.5rem" : "auto",
            }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </p>
    );
  }
  