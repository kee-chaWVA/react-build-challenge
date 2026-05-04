import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import Button from "../components/Button"
import { fetchPokemon, fetchPokemonList } from "../queries/pokemonApi"
import type { PokemonListItem } from "../queries/pokemonApi"
import { capitalize } from "../shared/utils/stringUtils"
import Fuse from 'fuse.js'
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation"
import '../styles/SearchControl.css'
import '../styles/PokemonPage.css'
import SearchControl from "../components/SearchControl";
import PokedexDisplay from "../components/PokedexDisplay";

export default function PokemonPage() {
  const [ searchWord, setSearchWord ] = useState<string>('');
  const [ committedSearch, setCommittedSearch ] = useState<string>('')
  const [ activeSuggestion, setActiveSuggestion ] = useState<number>(-1)
  const [isPokedexOpen, setIsPokedexOpen] = useState(false);
  
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
    setIsPokedexOpen(true)
    setSearchWord('')
    setActiveSuggestion(-1)
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
    onSelect: (pokemon) => handleSearch(pokemon.name)
  })

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
    <main aria-labelledby="pokemon-heading" className="pokemon-page">
      <header className="pokemon-header">
        <h1 id="pokemon-heading">Pokémon Encyclopedia</h1>
        <SearchControl<PokemonListItem>
          label="Search Pokémon"
          inputId="pokemon-search-bar"
          listboxId="pokemon-suggestion-list"
          value={searchWord}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          items={suggestions}
          activeIndex={activeSuggestion}
          getOptionId={(pokemon) => `pokemon-option-${pokemon.name}`}
          renderOption={(pokemon) => capitalize(pokemon.name)}
          onSelect={(pokemon) => handleSearch(pokemon.name)}
          action={
            <Button onClick={handleButtonClick}>
              Search Pokémon
            </Button>
          }
        />
      </header>
      <PokedexDisplay
        pokemon={data}
        isOpen={isPokedexOpen}
        onClose={() => setIsPokedexOpen(false)}
      />
    </main>
  )
}