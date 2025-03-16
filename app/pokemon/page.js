"use client";

import React, { useEffect, useState, useReducer, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PokemonList from "../components/PokemonList";
import statsReducer from "../components/StatsReducer";
import { StatsContext } from "../components/StatsProvider";
import { getAllPokemons, getPokemonDetails } from "../services/pokemonService";

const PokemonPage = () => {
  const { numberFormat, sortBy, viewType, updatePreferences } =
    useContext(StatsContext);

  const [typeFilter, setTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [allPokemonDetails, setAllPokemonDetails] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [storedFavorites, setStoredFavorites] = useState([]);
  const [selectedPokemons, setSelectedPokemons] = useState([]);
  const [selectedPokemonNames, setSelectedPokemonNames] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, dispatch] = useReducer(statsReducer, {
    filteredPokemons: [],
    stats: {},
    history: [],
  });

  // Wywołanie akcji do obliczenia statystyk
  useEffect(() => {
    dispatch({ type: "CALCULATE_STATS", payload: { statsType: "favorites" } });
    dispatch({
      type: "CALCULATE_STATS",
      payload: { statsType: "mostFrequentType" },
    });
    dispatch({
      type: "CALCULATE_STATS",
      payload: { statsType: "averageRating" },
    });
    dispatch({
      type: "CALCULATE_STATS",
      payload: { statsType: "top3Pokemons" },
    });
    dispatch({
      type: "CALCULATE_STATS",
      payload: { statsType: "typeDistribution" },
    });
    setFilteredPokemons(state.filteredPokemons);
  }, [state.filteredPokemons]);

  useEffect(() => {
    dispatch({ type: "SORT_DATA", payload: { sortBy } });
  }, [sortBy]);

  useEffect(() => {
    const type = searchParams.get("type") || "";
    const search = searchParams.get("search") || "";
    const limitParam = searchParams.get("limit") || "20";

    const filters = { type, search, limit: limitParam };

    localStorage.setItem("filters", JSON.stringify(filters));

    setTypeFilter(type);
    setSearchQuery(search);
    setLimit(parseInt(limitParam, 10));
  }, [searchParams]);

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      try {
        const fetchedPokemons = await getAllPokemons();

        const fetchedPokemonDetails = await Promise.all(
          fetchedPokemons.map((pokemon) => getPokemonDetails(pokemon.url))
        );
        setAllPokemonDetails(fetchedPokemonDetails);

        const comparePokemons =
          JSON.parse(localStorage.getItem("PokemonsToCompare")) || [];

        if (comparePokemons && comparePokemons.length > 0) {
          setSelectedPokemons(comparePokemons);
          const names = comparePokemons
            .map((comparePokemon) => {
              const pokemon = fetchedPokemonDetails.find(
                (pokemon) => pokemon.id === comparePokemon
              );
              return pokemon ? pokemon.name : null;
            })
            .filter((name) => name !== null);

          setSelectedPokemonNames(names);
        }
        localStorage.setItem("page", JSON.stringify("pokemon_list"));
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setStoredFavorites(savedFavorites);
  }, []);

  // Użycie useEffect do filtrowania danych
  useEffect(() => {
    const filtered = allPokemonDetails || [];
    dispatch({ type: "LOAD_DATA", payload: filtered });
    const sortBy = JSON.parse(localStorage.getItem("sortBy"));
    dispatch({ type: "SORT_DATA", payload: { sortBy } });
    dispatch({
      type: "FILTER_DATA",
      payload: { typeFilter, searchQuery, limit },
    });
  }, [allPokemonDetails, typeFilter, searchQuery, limit]);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("search", query);
    router.push(`/pokemon?${currentParams.toString()}`);
  };

  const handleTypeChange = (type) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("type", type);
    router.push(`/pokemon?${currentParams.toString()}`);
  };

  const handleLimitChange = (value) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("limit", value);
    router.push(`/pokemon?${currentParams.toString()}`);
  };

  const handleUpdatePreferences = (key, value) => {
    updatePreferences(key, value);
  };

  const handleAddToFavorites = (pokemon) => {
    if (!storedFavorites.some((fav) => fav.id === pokemon.id)) {
      const updatedFavorites = [...storedFavorites, pokemon];
      state.favorites = updatedFavorites;
      setStoredFavorites(updatedFavorites);
      dispatch({
        type: "CALCULATE_STATS",
        payload: { statsType: "favorites" },
      });
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  const handleSelectPokemon = (pokemon) => {
    router.push(`/pokemon/${pokemon.id}`);
  };

  const handleViewNotes = (pokemon) => {
    router.push(`/notes/${pokemon.id}`);
  };

  const handleCompare = (pokemon) => {
    if (selectedPokemons.includes(pokemon.id)) {
      setErrorMessage("Nie można porównywać Pokémona z samym sobą.");
      return;
    }
    setErrorMessage(""); // Wyczyść poprzedni błąd

    if (selectedPokemons.length < 2) {
      const compareElements = [...selectedPokemons, pokemon.id];
      setSelectedPokemons(compareElements);
      localStorage.setItem(
        "PokemonsToCompare",
        JSON.stringify(compareElements)
      );
      const updatedSelectedPokemonNames = [
        ...selectedPokemonNames,
        pokemon.name,
      ];
      setSelectedPokemonNames(updatedSelectedPokemonNames);
    } else {
      const compareElements = [
        selectedPokemons[selectedPokemons.length - 1],
        pokemon.id,
      ];
      setSelectedPokemons(compareElements);
      localStorage.setItem(
        "PokemonsToCompare",
        JSON.stringify(compareElements)
      );
      const updatedSelectedPokemonNames = [
        selectedPokemonNames[selectedPokemonNames.length - 1],
        ,
        pokemon.name,
      ];
      setSelectedPokemonNames(updatedSelectedPokemonNames);
    }
  };

  const deleteFromCompare = (name) => {
    const pokemon = allPokemonDetails.find(
      (pokemon) => pokemon.name.toLowerCase() === name.toLowerCase()
    );

    if (pokemon) {
      const compareElements = selectedPokemons.filter((x) => x !== pokemon.id);
      setSelectedPokemons(compareElements);

      const updatedNames = selectedPokemonNames.filter((x) => x !== name);
      setSelectedPokemonNames(updatedNames);

      localStorage.setItem(
        "PokemonsToCompare",
        JSON.stringify(compareElements)
      );
    }
  };

  return (
    <div>
      <h1>Pokémon List</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          margin: "10px",
        }}
      >
        <div>
          <h2>Preferencje:</h2>
          <div>
            <label>
              Format liczb:
              <select
                value={numberFormat}
                onChange={(e) => {
                  handleUpdatePreferences("numberFormat", e.target.value);
                }}
              >
                <option value="percentage">%</option>
                <option value="decimal">Decimal</option>
                <option value="rounded">Rounded</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Sortowanie:
              <select
                value={sortBy}
                onChange={(e) =>
                  handleUpdatePreferences("sortBy", e.target.value)
                }
              >
                <option value="id">ID</option>
                <option value="name">Nazwa</option>
                <option value="attack">Atak</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Widok:
              <select
                value={viewType}
                onChange={(e) =>
                  handleUpdatePreferences("viewType", e.target.value)
                }
              >
                <option value="table">Tabela</option>
                <option value="cards">Karty</option>
              </select>
            </label>
          </div>
        </div>
        <div>
          <h2>Podstawowe Statystyki:</h2>
          <p>Liczba ulubionych: {state.stats.favoriteCount || 0}</p>
          <p>
            Najczęstszy typ: {state.stats.mostFrequentType || "Brak danych"}
          </p>
          <p>Średnia ocena: {state.stats.averageRating || 0}</p>
        </div>
        <div>
          <h2>Szczegółowe Statystyki:</h2>
          <h3>Top 3 Pokemony:</h3>
          <ul>
            {state.stats.top3Pokemons?.map((pokemon, index) => (
              <li key={index}>
                {pokemon.name} - Atak: {pokemon.attack}
              </li>
            ))}
          </ul>

          <h3>Rozkład typów:</h3>
          <ul>
            {Object.entries(state.stats.typeDistribution || {}).map(
              ([type, count], index) => (
                <li key={index}>
                  {type}: {count}
                </li>
              )
            )}
          </ul>

          <h3>Historia aktywności:</h3>
          <ul>
            {state.history.map((entry, index) => (
              <li key={index}>
                <strong>{entry.date}:</strong> Typ: {entry.filters.type},
                Wyszukiwanie: {entry.filters.search}, Limit:{" "}
                {entry.filters.limit}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Search for a Pokémon..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select
          onChange={(e) => handleTypeChange(e.target.value)}
          value={typeFilter}
        >
          <option value="">All Types</option>
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          <option value="grass">Grass</option>
          <option value="electric">Electric</option>
          <option value="ground">Ground</option>
          <option value="normal">Normal</option>
          <option value="flying">Flying</option>
          <option value="poison">Poison</option>
          <option value="rock">Rock</option>
          <option value="bug">Bug</option>
          <option value="ghost">Ghost</option>
          <option value="steel">Steel</option>
          <option value="psychic">Psychic</option>
          <option value="ice">Ice</option>
          <option value="dragon">Dragon</option>
          <option value="dark">Dark</option>
          <option value="fairy">Fairy</option>
        </select>
        <input
          type="number"
          value={limit}
          onChange={(e) => handleLimitChange(e.target.value)}
          min="1"
          max="100"
        />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {selectedPokemonNames.length > 0 && (
            <div id="choose_list">
              <h2>Wybrane Pokémony do porównania:</h2>
              <ul>
                {selectedPokemonNames.map((name, index) => (
                  <li key={index}>
                    {name}{" "}
                    <button onClick={() => deleteFromCompare(name)}>
                      Usuń z porównania
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {errorMessage && (
            <p
              className="error"
              style={{
                color: "red",
                textDecoration: "underline",
                fontWeight: "bold",
              }}
            >
              {errorMessage}
            </p>
          )}
          <PokemonList
            pokemons={filteredPokemons}
            onSelectPokemon={handleAddToFavorites}
            handleSelectPokemon={handleSelectPokemon}
            onComparePokemon={handleCompare}
            onNotes={handleViewNotes}
            location={"list"}
            viewType={viewType}
          />
        </>
      )}
    </div>
  );
};

export default PokemonPage;
