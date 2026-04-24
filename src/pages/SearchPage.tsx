import { useState } from 'react';
import type { Movie } from '../types/movie'
import { movies } from '../data/movies';
import Button from '../components/Button';
import List from '../components/List';
import Card from '../components/Card';
import Fuse, { type FuseResult } from 'fuse.js';
import '../SearchPage.css'

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


  const handleSearch = () => {
    if(!searchWord.trim()) {
      setError('You must enter a movie title.' )
      return;
    }
    setCommittedSearch(searchWord)
    setError('')
  }

  const handleChange = (e) => {
    setError('')
    setSearchWord(e.target.value)
  }

  const suggestions = fuse.search(searchWord)
  const movieFromFuse = suggestions.slice(0,5).map( (result) =>  result.item )

  const results = movies.filter((movie) => {
    return movie.title.toLowerCase().includes(committedSearch.toLowerCase().trim())
  })

  return(
    <>
      <header>
        {error &&
          <p id='movie-search-error'>
            {error}
          </p>}
        <label
          htmlFor='movie-search-bar'
          className='hidden'
        >
          Search Movie
        </label>
        <input
          id='movie-search-bar'
          type='search'
          value={searchWord}
          onChange={handleChange}
          aria-describedby={error ? 'movie-search-error' : undefined}
          aria-invalid={Boolean(error)}
        />
        <Button onClick={handleSearch}>Search Movie</Button>
      </header>
      <section>
        {searchWord.trim() && (
          suggestions.length > 0 ? (
            <List<Movie>
              items={movieFromFuse}
              renderItem={(movie) =>{
                return (
                  <li key={movie.id}>
                    <p>{movie.title}</p>
                  </li>
                )}
              }
            />
          ) : (
            <p>
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
          <p>No Movies Found</p>
            )
          )
        }
      </section>
    </>
  )
}