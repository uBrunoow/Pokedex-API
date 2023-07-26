'use client'

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PokedexImage from '../../public/pokedex.png'

export default function Home() {

  const [pokemon, setPokemon] = useState('');
  const [searchPokemon, setSearchPokemon] = useState(1);

  const pokemonImageRef = useRef<HTMLImageElement>(null);
  const pokemonNameRef = useRef<HTMLSpanElement>(null);
  const pokemonIdRef = useRef<HTMLSpanElement>(null);

  const handlePokemon = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPokemon(value.toLowerCase());
  };

  async function fetchPokemonData(pokemon: string) {
    try {
      const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

      if (APIResponse.status === 200) {
        const data = await APIResponse.json();
        console.log(data)
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  
  const renderPokemon = async (pokemon: string) => {
    try {
      const data = await fetchPokemonData(pokemon);
      if (data) {
        // Atualizar os estados para exibir os dados do Pokémon
        setPokemon('');
        setSearchPokemon(data.id);   

        if (pokemonImageRef.current && pokemonNameRef.current && pokemonIdRef.current) {
          pokemonImageRef.current.src = data.sprites.versions['generation-v']['black-white'].animated.front_default;
          pokemonNameRef.current.innerHTML = data.name;
          pokemonIdRef.current.innerHTML = data.id
        }

      } else {
        // Atualizar os estados para exibir uma mensagem de Pokémon não encontrado
        setSearchPokemon(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    renderPokemon('1'); // O número '1' representa o primeiro Pokémon
  }, []);
  
  return (
    <>
      <main className="bg-sky-500 h-screen w-full">
        <div className=" flex items-center justify-center h-full w-full flex-col p-[15px]">
          <Image src={PokedexImage} alt="pokedex" className=" w-full max-w-[426px] relative" />
          <div className=" absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-[426px] h-[638.48px]">
            <Image src={''} alt="pokemon" className="w-[100px] h-[100px] absolute top-[50%] left-[50%] translate-x-[-70%] translate-y-[-100%]" ref={pokemonImageRef} />

              <h1 className=" absolute bottom-[41%] left-[00%] w-[75%] flex items-center justify-end text-[#111] font-bold text-[20px]">
                <span className=" mr-5" ref={pokemonIdRef}></span>
                <span className="capitalize" ref={pokemonNameRef}> </span> 
              </h1>

              <form className=" absolute bottom-[25%] left-[11%] flex w-[70%] h-[50px]" onSubmit={(e) => { e.preventDefault(); renderPokemon(pokemon); }}>
                <input
                  type="search"
                  className=" w-full p-[4%] outline-none border-x-[2px] border-y-[2px] border-black rounded-md"
                  placeholder="Name or Number"
                  required
                  onChange={handlePokemon}
                  value={pokemon}
                />
                <button type="submit"></button>
              </form> 

              <div className=" absolute bottom-10 left-10 w-[73%] flex gap-5 items-center justify-center">
                <button className="w-[50%] p-[4%] border-x-[2px] border-y-[2px] border-black rounded-[5px] bg-[#ddd] font-bold btn-prev active:bg-[#777]" onClick={() => { if (searchPokemon > 1) renderPokemon((searchPokemon - 1).toString()); }}>Prev &lt;</button>
                <button className="w-[50%] p-[4%] border-x-[2px] border-y-[2px] border-black rounded-[5px] bg-[#ddd] font-bold btn-next  active:bg-[#777]" onClick={() => renderPokemon((searchPokemon + 1).toString())}>Next &gt;</button>
              </div>
            </div>
          </div>
      </main>
    </>
  )
}
