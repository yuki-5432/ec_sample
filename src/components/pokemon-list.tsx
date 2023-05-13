import React from 'react'
import Card from './card'

const PokemonList = () => {
  const pokemonNums = []

  let num = 1
  while (num <= 20) {
    pokemonNums.push(`${num}`)
    num++
  }

  return (
    <section id="pokemon-list" className="bg-stone-400 py-20">
      <div className="max-w-5xl px-5 mx-auto">
        <h2 className="font-bold text-4xl text-yellow-500 mb-10">POKEMON</h2>
        <ul className="grid grid-cols-3 gap-6">
          {pokemonNums.map((num) => (
            <Card key={num} number={num} />
          ))}
        </ul>
      </div>
    </section>
  )
}

export default PokemonList
