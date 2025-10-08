export default function AuthorSelector({
    authors,
    guessedAuthors,
    onGuess,
  }) {
    return (
      <div style={{ marginTop: "2rem" }}>
        <h3>Who said it?</h3>
        <select onChange={(e) => onGuess(e.target.value)} defaultValue="">
          <option value="" disabled>
            Select an author
          </option>
          {authors.map((author) => (
            <option
              key={author}
              value={author}
              disabled={guessedAuthors.has(author)}
            >
              {guessedAuthors.has(author) ? `${author} (guessed)` : author}
            </option>
          ))}
        </select>
      </div>
    );
  }
  