"use client";

import React, { useState, useEffect } from "react";
import { getPokemonDetails, getAllPokemons } from "../services/pokemonService";
import ComparisonView from "../components/PokemonCompare";

const ComparisonPage = () => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);
  const [selected1, setSelected1] = useState("");
  const [selected2, setSelected2] = useState("");
  const [pokemonNames, setPokemonNames] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Pobierz wszystkie nazwy Pokémonów na początku
  useEffect(() => {
    const fetchAllPokemonNames = async () => {
      try {
        setLoading(true);
        const allPokemons = await getAllPokemons();

        const allPokemonDetails = await Promise.all(
          allPokemons.map((pokemon) => getPokemonDetails(pokemon.url))
        );

        setAllPokemons(allPokemonDetails);
        const names = allPokemonDetails.map((pokemon) => pokemon.name);
        setPokemonNames(names);
      } catch (error) {
        console.error("Błąd podczas pobierania listy Pokémonów:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPokemonNames();

    // Pobierz identyfikatory dwóch Pokémonów z localStorage
    const storedPokemonIds = JSON.parse(
      localStorage.getItem("PokemonsToCompare")
    );
    if (storedPokemonIds && storedPokemonIds.length === 1) {
      setSelected1(storedPokemonIds[0]);
      handleFetchPokemon(storedPokemonIds[0], setPokemon1);
    } else if (storedPokemonIds && storedPokemonIds.length === 2) {
      setSelected1(storedPokemonIds[0]);
      setSelected2(storedPokemonIds[1]);
      handleFetchPokemon(storedPokemonIds[0], setPokemon1);
      handleFetchPokemon(storedPokemonIds[1], setPokemon2);
    }
  }, []);

  // Funkcja do przekształcania nazwy na ID
  const getPokemonIdByName = (name) => {
    if (!allPokemons || allPokemons.length === 0) {
      return null;
    }
    const pokemon = allPokemons.find(
      (pokemon) => pokemon.name.toLowerCase() === name.toLowerCase()
    );
    return pokemon ? pokemon.id : null;
  };

  const handleFetchPokemon = async (pokemonId, setter) => {
    if (isNaN(pokemonId) || pokemonId < 1) {
      setError("ID Pokémonów musi być liczbą większą od 0.");
      setPokemon1(null);
      setPokemon2(null);
      return;
    }

    setError("");
    try {
      const details = await getPokemonDetails(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
      );
      setter(details);
    } catch (error) {
      console.error("Błąd podczas pobierania danych Pokémona:", error);
      setError("Nie udało się pobrać danych Pokémona.");
    }
  };

  const handleCompare = () => {
    if (!selected1 || !selected2) {
      setError("Proszę podać oba Pokemony.");
      setPokemon1(null);
      setPokemon2(null);
      return;
    }

    const id1 = isNaN(selected1) ? getPokemonIdByName(selected1) : selected1;
    const id2 = isNaN(selected2) ? getPokemonIdByName(selected2) : selected2;

    // Jeśli oba ID są takie same, wyświetl błąd
    if (String(id1) === String(id2)) {
      setError("Nie możesz porównać tego samego Pokémona z samym sobą.");
      setPokemon1(null);
      setPokemon2(null);
      return;
    }

    if (id1 && id2) {
      handleFetchPokemon(id1, setPokemon1);
      handleFetchPokemon(id2, setPokemon2);
    } else {
      setError("Podaj poprawne ID lub nazwę Pokémona.");
    }
  };

  const clearComparison = () => {
    setPokemon1(null);
    setPokemon2(null);
    setSelected1("");
    setSelected2("");
    setError("");
    localStorage.removeItem("PokemonsToCompare");
  };

  return (
    <div>
      <h1>Porównanie Pokémonów</h1>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="search_compare">
            <div className="input-group">
              <label>
                Pokémon 1:
                <input
                  type="text"
                  value={selected1}
                  onChange={(e) => setSelected1(e.target.value)}
                  placeholder="Wpisz nazwę lub ID"
                  list="pokemon-list-1"
                />
                <datalist id="pokemon-list-1">
                  {pokemonNames.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </label>

              <label>
                Pokémon 2:
                <input
                  type="text"
                  value={selected2}
                  onChange={(e) => setSelected2(e.target.value)}
                  placeholder="Wpisz nazwę lub ID"
                  list="pokemon-list-2"
                />
                <datalist id="pokemon-list-2">
                  {pokemonNames.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </label>
            </div>
            <button onClick={handleCompare}>Porównaj</button>
          </div>

          {error && (
            <div
              style={{
                color: "red",
                textDecoration: "underline",
                fontWeight: "bold",
              }}
            >
              {error}
            </div>
          )}

          {pokemon1 && pokemon2 && (
            <ComparisonView
              pokemon1={pokemon1}
              pokemon2={pokemon2}
              clearComparison={clearComparison}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ComparisonPage;
