"use client";
import { useParams, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import PokemonDetails from "../../components/PokemonDetails";
import { getPokemonDetails } from "../../services/pokemonService";
import Breadcrumbs from "../../components/Breadcrumbs";

const PokemonDetailsPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [breadcrumbsPath, setBreadcrumbsPath] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (id) {
      const pokemonId = parseInt(id, 10);

      if (isNaN(pokemonId) || pokemonId < 1 || pokemonId > 10277) {
        setErrorMessage(
          "Id of Pokémon can't be lower than 1 or higher than 10277."
        );
        setLoading(false);
        return;
      }

      async function fetchPokemonDetails() {
        setLoading(true);
        setError(null);
        try {
          const details = await getPokemonDetails(
            `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
          );

          if (!details || !details.name) {
            throw new Error("Pokemon not found");
          }

          setPokemon(details);

          const filters = JSON.parse(localStorage.getItem("filters")) || [];

          const currentParams = new URLSearchParams(searchParams.toString());
          currentParams.set("type", filters.type);
          currentParams.set("limit", filters.limit);
          currentParams.set("search", filters.search);

          const page = JSON.parse(localStorage.getItem("page")) || [];
          if (page === "pokemon_list") {
            setBreadcrumbsPath([
              { name: "Home", url: "/" },
              {
                name: "Pokémon List",
                url: `/pokemon?${currentParams.toString()}`,
              },
              { name: details.name, url: `/pokemon/${details.id}` },
            ]);
          } else {
            setBreadcrumbsPath([
              { name: "Home", url: "/" },
              { name: "Favorites", url: "/favorites" },
              { name: details.name, url: `/pokemon/${details.id}` },
            ]);
          }
        } catch (error) {
          console.error("Error fetching Pokémon details:", error);
          setError("Failed to fetch Pokémon details.");
        } finally {
          setLoading(false);
        }
      }

      fetchPokemonDetails();
    }
  }, [id, searchParams]);

  return (
    <div>
      <Breadcrumbs path={breadcrumbsPath} />
      <h1>Pokemon Details</h1>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {errorMessage && <div>{errorMessage}</div>}
      {pokemon && !loading && !error && <PokemonDetails pokemon={pokemon} />}
    </div>
  );
};

export default PokemonDetailsPage;
