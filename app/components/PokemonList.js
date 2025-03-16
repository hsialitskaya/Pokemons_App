import React from "react";

const PokemonList = ({
  pokemons,
  onSelectPokemon,
  handleSelectPokemon,
  onComparePokemon,
  location,
  onNotes,
  viewType,
}) => {
  if (viewType === "table") {
    return (
      <table className="pokemon-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pokemons.map((pokemon) => (
            <tr key={pokemon.id}>
              <td style={{ paddingRight: "20px" }}>#{pokemon.id}</td>
              <td>{pokemon.name}</td>
              <td>
                <img
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
              </td>
              <td>
                <button
                  style={{ margin: "0 10px" }}
                  onClick={() => onSelectPokemon(pokemon)}
                >
                  {location === "list"
                    ? "Dodaj do ulubionych"
                    : "Usuń z ulubionych"}
                </button>
                <button
                  style={{ margin: "0 10px" }}
                  onClick={() => onComparePokemon(pokemon)}
                >
                  Dodaj do porównania
                </button>
                <button
                  style={{ margin: "0 10px" }}
                  onClick={() => handleSelectPokemon(pokemon)}
                >
                  Zobacz szczegóły
                </button>
                <button
                  style={{ margin: "0 10px" }}
                  onClick={() => onNotes(pokemon)}
                >
                  Zobacz notatki
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="pokemon-list">
      {pokemons.map((pokemon) => (
        <div key={pokemon.id} className="pokemon-card">
          <p>#{pokemon.id}</p>
          <h4>{pokemon.name}</h4>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />

          <button onClick={() => onSelectPokemon(pokemon)}>
            {location === "list" ? "Dodaj do ulubionych" : "Usuń z ulubionych"}
          </button>
          <button onClick={() => onComparePokemon(pokemon)}>
            Dodaj do porównania
          </button>
          <button onClick={() => handleSelectPokemon(pokemon)}>
            Zobacz szczegóły
          </button>
          <button onClick={() => onNotes(pokemon)}>Zobacz notatki</button>
        </div>
      ))}
    </div>
  );
};

export default PokemonList;
