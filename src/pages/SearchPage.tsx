import { useState } from 'react';
import type { Movie } from '../types/movie'
import { movies } from '../data/movies';
import Button from '../components/Button';
import List from '../components/List';
import Card from '../components/Card';
import Fuse from 'fuse.js';
import '../SearchPage.css'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

const fuse = new Fuse(
  movies, {
    keys: ['title'],
    threshold: 0.35
  }
)

export default function SearchPage() {
  const [ searchWord, setSearchWord ] = useState<string>('');
  const [ committedSearch, setCommittedSearch ] = useState<string>('')
  const [ error, setError ] = useState<string>('')
  const [ activeSuggestion, setActiveSuggestion ] = useState<number>(-1)
  const suggestions = fuse.search(searchWord)
  const movieFromFuse = suggestions.slice(0,5).map( (result) =>  result.item )
  

  const handleSearch = (value?: string) => {
    const finalValue = value ?? searchWord;
    if(!finalValue.trim()) {
      setError('You must enter a movie title.' )
      return;
    }
    setCommittedSearch(finalValue)
    setError('')
    setSearchWord('')
    setActiveSuggestion(-1)
  }

  const handleKeyDown = useKeyboardNavigation<Movie>({
    items: movieFromFuse,
    activeIndex: activeSuggestion,
    setActiveIndex: setActiveSuggestion,
    onSelect: (movie) => handleSearch(movie.title),
    onEnter: () => handleSearch()
  })
    
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    setActiveSuggestion(-1)
    setSearchWord(e.currentTarget.value)
    setCommittedSearch('')
  }

  const results = movies.filter((movie) => {
    return movie.title.toLowerCase().includes(committedSearch.toLowerCase().trim())
  })

  const inputValue =
    activeSuggestion >= 0
      ? movieFromFuse[activeSuggestion].title
      : searchWord;
  
  return(
    <>
      <header>
        {error &&
          <p 
            id='movie-search-error'
            aria-live="assertive"
          >
            {error}
          </p>}
        <label
          htmlFor='movie-search-bar'
          className='visually-hidden'
        >
          Search Movie
        </label>
        <input
          id='movie-search-bar'
          type='search'
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-describedby={error ? 'movie-search-error' : undefined}
          aria-invalid={Boolean(error)}
          aria-activedescendant={
            activeSuggestion >= 0
              ? `movie-option-${movieFromFuse[activeSuggestion].id}`
              : undefined
          }
          aria-controls='movie-suggestion-list'
          aria-expanded={suggestions.length > 0}
        />
        <Button onClick={handleSearch}>Search Movie</Button>
      </header>
      <section>
        {searchWord.trim() && (
          suggestions.length > 0 ? (
            <List<Movie>
              id='movie-suggestion-list'
              className='search-suggestions'
              role='listbox'
              items={movieFromFuse}
              renderItem={(movie, index) =>{
                const isActive = index === activeSuggestion
                return (
                  <li
                    id={`movie-option-${movie.id}`}
                    key={movie.id}
                    className={isActive ? 'active' : undefined}
                    role='option'
                    aria-selected={isActive ? true : false}
                    onMouseDown={() => handleSearch(movie.title)}
                    >
                      <p>{movie.title}</p>
                  </li>
                )}
              }
            />
          ) : (
            <p
              aria-live="polite"
            >
              No matching movies
            </p>
          )
        )}
      </section>
      <section>
        { committedSearch && (
          results.length > 0 ? (
            <List<Movie> 
              className='search-results'
              items={results}
              renderItem={(movie) => {
                return(
                  <li key={movie.id}>     
                    <Card>
                      <strong>{movie.title}</strong>
                      <p>Released: {movie.releaseYear}</p>
                      <p>Actor: {movie.actor}</p>
                      <p>Director: {movie.director}</p>
                    </Card>
                    <br/>
                  </li>
                )
              }}
            />
            ) : (
          <p
            aria-live="polite"
          >
            No Movies Found
          </p>
            )
          )
        }
      </section>
    </>
  )
}