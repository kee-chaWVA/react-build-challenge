import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import Button from "../components/Button"
import { fetchPokemon, fetchPokemonList } from "../queries/pokemonApi"
import type { PokemonListItem } from "../queries/pokemonApi"
import { capitalize } from "../shared/utils/stringUtils"
import Fuse from 'fuse.js'
import List from "../components/List"
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation"
import Card from "../components/Card"

export default function PokemonPage() {
  const [ searchWord, setSearchWord ] = useState<string>('');
  const [ committedSearch, setCommittedSearch ] = useState<string>('')
  const [ activeSuggestion, setActiveSuggestion ] = useState<number>(-1)
  const [showMore, setShowMore] = useState(false)
  const [showAllMoves, setShowAllMoves] = useState(false);
  
  const { data: listData } = useQuery({
    queryKey: ["pokemonList"],
    queryFn: fetchPokemonList,
  })
  
  const fuse = useMemo(() => {
    if (!listData?.results) return null;
    
    return new Fuse(listData.results, {
      keys: ["name"],
      threshold: 0.35,
    });
  }, [listData]);

  const suggestions = useMemo(() => {
    if (!fuse || !searchWord.trim()) return [];
    return fuse.search(searchWord).slice(0, 10).map(r => r.item);
  }, [fuse, searchWord]);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['pokemon', committedSearch],
    queryFn: () => fetchPokemon(committedSearch),
    enabled: !!committedSearch
  })

  const handleSearch = (value?: string) => {
    const finalValue = value ?? searchWord;
    if(!finalValue.trim())return
    setCommittedSearch(finalValue)
    setSearchWord('')
    setActiveSuggestion(-1)
    setShowMore(false)
    setShowAllMoves(false)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActiveSuggestion(-1)
    setSearchWord(e.currentTarget.value)
    setCommittedSearch('')
  }

  const handleKeyDown = useKeyboardNavigation<PokemonListItem>({
    items: suggestions,
    activeIndex: activeSuggestion,
    setActiveIndex: setActiveSuggestion,
    onSelect: (pokemon) => handleSearch(pokemon.name),
    onEnter: () => {
        if (suggestions[0]) {
          handleSearch(suggestions[0].name)
        }
    }})

  const handleButtonClick = () => {
    if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
      handleSearch(suggestions[activeSuggestion].name);
    } else {
      handleSearch();
    }
  };
  

  if (isLoading) {
    return <p>Loading…</p>
  }
  
  if (error) {
    return <p>Something went wrong</p>
  }

  return (
    <>
      <header>
        <h3>
        Pokémon Encyclopedia
        </h3>
      </header>
      <section>
        <label htmlFor="pokemon-search-bar" className="visually-hidden">Search Pokemon</label>
        <input
          id='pokemon-search-bar'
          type='search'
          value={searchWord}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          aria-controls="pokemon-suggestion-list"
          aria-expanded={suggestions.length > 0}
          aria-activedescendant={
            activeSuggestion >= 0
              ? `pokemon-option-${suggestions[activeSuggestion].name}`
              : undefined
          }
        
        />
        <Button onClick={handleButtonClick}>Search Pokémon</Button>
      </section>
      <section>
        {searchWord.trim() && (
          suggestions.length > 0 ? (
            <List<PokemonListItem>
              id='pokemon-suggestion-list'
              className='search-suggestions'
              role='listbox'
              items={suggestions}
              renderItem={(pokemon, index) =>{
                const isActive = index === activeSuggestion
                return (
                  <li
                    id={`pokemon-option-${pokemon.name}`}
                    key={pokemon.name}
                    className={isActive ? 'active' : undefined}
                    role='option'
                    aria-selected={isActive ? true : false}
                    onMouseDown={() => handleSearch(pokemon.name)}
                    >
                      <p>{capitalize(pokemon.name)}</p>
                  </li>
                )}
              }
            />
          ) : (
            <p
              aria-live="polite"
            >
              No matching Pokémon
            </p>
          )
        )}
      </section>
      <section>
        <div>
          {data?.sprites?.other?.["official-artwork"]?.front_default && (
            <Card>
              <img
                src={data.sprites.other["official-artwork"].front_default}
                alt={data.name}
                width={500}
              />
              <header>
                <h3>{capitalize(data.name)}</h3>
              </header>

              {data?.cries?.latest && (
                <section>
                  <strong>Cry:</strong>
                  <br />
                  <audio controls preload="none">
                    <source src={data.cries.latest} type="audio/ogg" />
                    Your browser does not support the audio element.
                  </audio>
                </section>
              )}
              <section>
                <p>
                  <strong>Types:</strong>{" "}
                  {data.types.map(t => capitalize(t.type.name)).join(", ")}
                </p>

                <p>
                  <strong>Abilities:</strong>{" "}
                  {data.abilities
                    .map(a => capitalize(a.ability.name))
                    .join(", ")}
                </p>

                <p>
                  <strong>Height:</strong> {data.height / 10} m
                </p>

                <p>
                  <strong>Weight:</strong> {data.weight / 10} kg
                </p>
              </section>
              <button
                type="button"
                onClick={() => setShowMore(prev => !prev)}
                aria-expanded={showMore}
              >
                {showMore ? "Hide details ▲" : "Show more ▼"}
              </button>

              {showMore && (
                <section>
                  <p>
                    <strong>Base Experience:</strong>{" "}
                    {data.base_experience}
                  </p>

                  <p>
                    <strong>Forms:</strong>{" "}
                    {data.forms.map(f => capitalize(f.name)).join(", ")}
                  </p>

                  <p>
                    <strong>Stats:</strong>{" "}
                    {data.stats
                      .map(
                        s =>
                          `${capitalize(
                            s.stat.name
                          )}: ${s.base_stat}`
                      )
                      .join(", ")}
                  </p>

                  <p>
                  <p>
                    <strong>Moves:</strong>{" "}
                    {(showAllMoves ? data.moves : data.moves.slice(0, 10))
                      .map(m => capitalize(m.move.name))
                      .join(", ")}
                  </p>

                  {data.moves.length > 10 && (
                    <button
                      type="button"
                      onClick={() => setShowAllMoves(prev => !prev)}
                      aria-expanded={showAllMoves}
                    >
                      {showAllMoves ? "Hide moves ▲" : "Show all moves ▼"}
                    </button>
                  )}
                  </p>
                </section>
              )}
            </Card>
          )}
        </div>
      </section>
    </>
  )
}