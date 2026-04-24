import { useState } from 'react';
import type { Movie } from '../types/movie'
import { movies } from '../data/movies';
import Button from '../components/Button';
import List from '../components/List';
import Card from '../components/Card';
import Fuse, { type FuseResult } from 'fuse.js';

const fuse = new Fuse(
  movies, {
    keys: ['title', 'actor', 'director'],
    threshold: 0.35
  }
)

export default function SearchPage() {
  const [ searchWord, setSearchWord ] = useState<string>('');
  const [ committedSearch, setCommittedSearch ] = useState<string>('')
  const [ error, setError ] = useState<string>('')


  const handleSearch = () => {
    if(!searchWord.trim()) {
      setError('You must enter a movie title, actor name, or director name.' )
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
    <div>
      <div>
        {error && <p>{error}</p>}
      </div>
      <div>
        <input
          type='text'
          value={searchWord}
          onChange={handleChange}
        />
        <Button onClick={handleSearch}>Search Movie</Button>
      </div>
      {searchWord.trim() && (
        suggestions.length > 0 ? (
          <div>
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
          </div>
        ) : (
          <div>
            <p>
              No matching movies
            </p>
          </div>
        )
      )}
      { committedSearch && (
        results.length > 0 ? (
          <List<Movie> 
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
    </div>
  )
}