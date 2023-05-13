import React, { FC, HTMLAttributes, useState } from 'react'
import {
  useGetPokemonByDescQuery,
  useGetPokemonByNameQuery,
} from '../services/pokemon'

interface Props extends HTMLAttributes<HTMLElement> {
  number: string
}

const Card: FC<Props> = ({ number, className, ...Props }) => {
  const [toggle, setToggle] = useState(false)

  const {
    data: pokemonData,
    error: pokemonError,
    isLoading: pokemonIsLoading,
  } = useGetPokemonByNameQuery(`${number}`)
  const {
    data: speciesData,
    error: speciesError,
    isLoading: speciesIsLoading,
  } = useGetPokemonByDescQuery(`${number}`)

  if (pokemonError || speciesError) {
    return <p className="text-red-600">Oh no, there was an error</p>
  } else if (pokemonIsLoading || speciesIsLoading) {
    return <p className="text-2xl">Loading...</p>
  } else if (pokemonData && speciesData) {
    const {
      species: { name },
      sprites: { front_default: img },
    } = pokemonData
    const jaFlavorText = speciesData.flavor_text_entries.filter((el) => {
      return el.language.name === 'ja' && el.version.name === 'x'
    })
    const { flavor_text: desc } = jaFlavorText[0]
    console.log(`${number} 完了`)

    return (
      <section
        className={`p-6 duration-500 ${className} ${
          toggle && ' text-white bg-blue-800 shadow-2xl'
        }`}
        onClick={() => setToggle(!toggle)}
      >
        <div>
          <img className="w-full" src={img} alt={name} width="96" height="96" />
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="mt-6 text-justify">{desc}</p>
        </div>
      </section>
    )
  } else {
    return null
  }
}

export default Card
