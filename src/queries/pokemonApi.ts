import { api } from "../api/client";

export type PokemonListItem = {
  name: string
  url: string
}

type PokemonListResponse = {
  results: PokemonListItem[]
}

export const fetchPokemonList = async (): Promise<PokemonListResponse> => {
   const res = await api.get<PokemonListResponse>(
     "https://pokeapi.co/api/v2/pokemon?limit=1300"
   )
   return res.data
 }

export const fetchPokemon = async (name: string) => {
  const response = await api.get(
    `https://pokeapi.co/api/v2/pokemon/${name}`
  )
  return response.data
}