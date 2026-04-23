import { useState } from 'react';
import type { Movie } from '../types/movie'
import { movies as initialMovies } from '../data/movies';
import Button from '../components/Button';
import List from '../components/List';
import Card from '../components/Card';

export default function SearchPage() {
  const [ movies, setMovies] = useState<Movie[]>(initialMovies)
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
                    <span>
                      <strong>
                        Title: 
                      </strong>
                      {movie.title}
                    </span>
                    <span>
                      <strong>
                        Released:
                      </strong>
                      {movie.releaseYear}
                    </span>
                    <span>
                      <strong>
                        Actor:
                      </strong>
                      {movie.actor}
                    </span>
                    <span>
                      <strong>
                        Director:
                      </strong>
                      {movie.director}
                    </span>
                  </Card>
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