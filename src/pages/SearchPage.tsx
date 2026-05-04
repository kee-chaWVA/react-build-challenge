import { useState } from 'react';
import type { Movie } from '../types/movie';
import { movies } from '../data/movies';
import Button from '../components/Button';
import FlashMessage from '../components/FlashMessage';
import UnorderedList from '../components/UnorderedList';
import Card from '../components/Card';
import Fuse from 'fuse.js';
import '../styles/SearchControl.css'
import '../styles/SearchPage.css';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import CardContent from '@mui/material/CardContent';
import Typography from "@mui/material/Typography";
import type { SubmitEventHandler } from "react";
import SearchControl from "../components/SearchControl";

const fuse = new Fuse(movies, {
  keys: ['title'],
  threshold: 0.35,
});

export default function SearchPage() {
  const [searchWord, setSearchWord] = useState<string>('');
  const [committedSearch, setCommittedSearch] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);

  const suggestions = fuse.search(searchWord);
  const movieFromFuse = suggestions.slice(0, 5).map(r => r.item);

  const commitSearch = (value?: string) => {
    const finalValue = value ?? searchWord;

    if (!finalValue.trim()) {
      setError('You must enter a movie title.');
      return;
    }

    setCommittedSearch(finalValue);
    setError('');
    setSearchWord('');
    setActiveSuggestion(-1);
  };

  const handleKeyDown = useKeyboardNavigation<Movie>({
    items: movieFromFuse,
    activeIndex: activeSuggestion,
    setActiveIndex: setActiveSuggestion,
    onSelect: movie => commitSearch(movie.title),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setActiveSuggestion(-1);
    setSearchWord(e.currentTarget.value);
    setCommittedSearch('');
  };

  const handleSubmit: SubmitEventHandler = (e) => {
    e.preventDefault();
    commitSearch(searchWord.trim());
  };

  const results = movies.filter(movie =>
    movie.title.toLowerCase().includes(committedSearch.toLowerCase().trim())
  );

  const gridClass =
    results.length === 1
      ? "results-one"
      : results.length === 2
      ? "results-two"
      : "results-three";

  return (
    <main aria-labelledby="search-heading" className="search-page">
      <header className="search-header">
        <h1 id="search-heading">Movie Search</h1>
        {error && (
          <FlashMessage
            message={error}
            autoHideDuration={3000}
            onClose={() => setError("")}
            className="flash-overlay"
          />
        )}
        <form onSubmit={handleSubmit} role="search" className="search-form">
          <SearchControl<Movie>
            label="Search Movie"
            inputId="movie-search-bar"
            listboxId="movie-suggestion-list"
            value={searchWord}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            items={movieFromFuse}
            activeIndex={activeSuggestion}
            getOptionId={(movie) => `movie-option-${movie.id}`}
            renderOption={(movie) => movie.title}
            onSelect={(movie) => commitSearch(movie.title)}
            action={<Button type="submit">Search Movie</Button>}
          />
        </form>
      </header>

      {/* RESULTS */}
      {committedSearch && (
        <section className="search-results-wrapper">
          {results.length > 0 ? (
            <UnorderedList<Movie>
              className={`search-results ${gridClass}`}
              items={results}
              renderListItem={movie => (
                <li key={movie.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="h2">
                        {movie.title}
                      </Typography>
                      <Typography variant="body2">
                        Released: {movie.releaseYear}
                      </Typography>
                      <Typography variant="body2">
                        Actor: {movie.actor}
                      </Typography>
                      <Typography variant="body2">
                        Director: {movie.director}
                      </Typography>
                    </CardContent>
                  </Card>
                </li>
              )}
            />
          ) : (
            <Typography
              variant="body1"
              color="text.secondary"
              aria-live="polite"
            >
              No Movies Found
            </Typography>
          )}
        </section>
      )}
    </main>
  );
}