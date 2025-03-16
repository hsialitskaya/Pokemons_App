"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PokemonList from "../components/PokemonList";

export default function FavoritesPage() {
  localStorage.setItem("page", JSON.stringify("favorites"));
  const [favorites, setFavorites] = useState([]);
  const [selectedPokemons, setSelectedPokemons] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  // Funkcja do przekierowania do strony szczegółów Pokémona
  const handleSelectPokemon = (pokemon) => {
    router.push(`/pokemon/${pokemon.id}`);
  };

  // Funkcja do usunięcia Pokémona z ulubionych
  const handleDeleteFromFavorites = (pokemon) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== pokemon.id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Zapisz w localStorage
  };

  const handleViewNotes = (pokemon) => {
    router.push(`/notes/${pokemon.id}`);
  };

  // Ładowanie ulubionych Pokémonów z localStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
    const storedPokemonIds = JSON.parse(
      localStorage.getItem("PokemonsToCompare")
    );
    setSelectedPokemons(storedPokemonIds);
  }, []);

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
    }
  };

  return (
    <div>
      <h1>Ulubione Pokémony</h1>
      {favorites.length === 0 ? (
        <p>Brak ulubionych Pokémonów.</p>
      ) : (
        <>
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
            pokemons={favorites}
            onSelectPokemon={handleDeleteFromFavorites}
            handleSelectPokemon={handleSelectPokemon}
            onComparePokemon={handleCompare}
            onNotes={handleViewNotes}
            location={"fav"}
          />
        </>
      )}
    </div>
  );
}
