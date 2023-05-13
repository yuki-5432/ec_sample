import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Pokemon, Species } from '../types/ApiService'

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2' }),
  endpoints: (builder) => ({
    getPokemonByName: builder.query<Pokemon, string>({
      query: (number) => `pokemon/${number}`,
    }),
    getPokemonByDesc: builder.query<Species, string>({
      query: (number) => `pokemon-species/${number}`,
    }),
  }),
})

export const { useGetPokemonByNameQuery, useGetPokemonByDescQuery } = pokemonApi
