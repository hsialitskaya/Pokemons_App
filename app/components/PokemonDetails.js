import React from "react";

function PokemonDetails({ pokemon }) {
  if (!pokemon) return null;

  const numberFormat =
    JSON.parse(localStorage.getItem("numberFormat")) || "decimal";

  const formatStat = (statValue) => {
    switch (numberFormat) {
      case "percentage":
        return `${statValue}%`;
      case "decimal":
        return statValue.toFixed(2);
      case "rounded":
        return Math.round(statValue);
      default:
        return statValue;
    }
  };

  return (
    <div id="pokemonDetails" className="pokemon-details">
      <div>
        <h2 id="pokemonName">{pokemon.name}</h2>
        <img
          id="pokemonImage"
          src={pokemon.sprites.front_default}
          alt={`Pokemon Image`}
        />
      </div>
      <div>
        <p>
          <strong>Typy:</strong>{" "}
          {pokemon.types.map((t) => t.type.name).join(", ")}
        </p>
        <p>
          <strong>Wzrost:</strong> {pokemon.height}
        </p>
        <p>
          <strong>Waga:</strong> {pokemon.weight}
        </p>
      </div>
      <div>
        <p>
          <strong>Statystyki:</strong>
        </p>
        <ul id="pokemonStats">
          {pokemon.stats.map((stat) => (
            <li key={stat.stat.name}>
              {stat.stat.name}: {formatStat(stat.base_stat)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PokemonDetails;
