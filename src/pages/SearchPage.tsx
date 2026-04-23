import { useState } from 'react';
import type { Movie } from '../types/movie'
import { movies as initialMovies } from '../data/movies';
import Button from '../components/Button';
import List from '../components/List';
import Card from '../components/Card';

export default function SearchPage() {
   const movies = initialMovies;
  // const [ movies, setMovies] = useState<Movie[]>(initialMovies)
  const [ searchWord, setSearchWord ] = useState<string>('');
  const [ committedSearch, setCommittedSearch ] = useState<string>('')

  const searchHandler = () => {
    if(!searchWord.trim()) return;
    setCommittedSearch(searchWord)
  }

  const results = movies.filter((movie) => {
    return movie.title.toLowerCase().includes(committedSearch.toLowerCase().trim())
  })

  return(
    <div>
      <input
        type='text'
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
      />
      <Button onClick={searchHandler}>Search Movie</Button>
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