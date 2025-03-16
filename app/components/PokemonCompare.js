import React from "react";

const ComparisonView = ({ pokemon1, pokemon2, clearComparison }) => {
  return (
    <div className="comparison-container">
      <div>
        {[pokemon1, pokemon2].map((pokemon, index) => (
          <div key={index} className="pokemon-comparison-card">
            {pokemon ? (
              <>
                <h3>{pokemon.name}</h3>
                <h3>#{pokemon.id}</h3>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                <h4>Typy:</h4>
                <p>{pokemon.types.map((type) => type.type.name).join(", ")}</p>
                <h4>Statystyki:</h4>
                <ul>
                  {pokemon.stats.map((stat) => (
                    <li key={stat.stat.name}>
                      {stat.stat.name}: {stat.base_stat}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>Wybierz Pokémona</p>
            )}
          </div>
        ))}
      </div>
      <button onClick={clearComparison}>Wyczyść porównanie</button>
    </div>
  );
};

export default ComparisonView;
