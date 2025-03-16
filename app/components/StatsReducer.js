const statsReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_DATA":
      return {
        ...state,
        filteredPokemons: action.payload,
      };

    case "CALCULATE_STATS":
      const { statsType } = action.payload;
      let stats = { ...state.stats };

      // Liczba ulubionych Pokémonów
      if (statsType === "favorites") {
        const fav = JSON.parse(localStorage.getItem("favorites")) || [];
        stats.favoriteCount = fav.length;
      }

      // Najczęstszy typ
      if (statsType === "mostFrequentType") {
        const typeCounts = {};
        state.filteredPokemons.forEach((pokemon) => {
          pokemon.types.forEach((type) => {
            typeCounts[type.type.name] = (typeCounts[type.type.name] || 0) + 1;
          });
        });

        stats.mostFrequentType =
          Object.keys(typeCounts).length > 0
            ? Object.keys(typeCounts).reduce((a, b) =>
                typeCounts[a] > typeCounts[b] ? a : b
              )
            : null; // Handle empty case by setting null
      }

      // Średnia ocena
      if (statsType === "averageRating") {
        const ratings = state.filteredPokemons.map((pokemon) =>
          pokemon.stats.some((stat) => stat.stat.name === "attack")
            ? pokemon.stats.find((stat) => stat.stat.name === "attack")
                .base_stat
            : 0
        );
        stats.averageRating =
          ratings.length > 0
            ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
            : 0;
      }

      // Top 3 Pokemony po ataku
      if (statsType === "top3Pokemons") {
        const topPokemons = [...state.filteredPokemons]
          .sort((a, b) => {
            const aAttack =
              a.stats.find((stat) => stat.stat.name === "attack")?.base_stat ||
              0;
            const bAttack =
              b.stats.find((stat) => stat.stat.name === "attack")?.base_stat ||
              0;
            return bAttack - aAttack;
          })
          .slice(0, 3);

        stats.top3Pokemons = topPokemons.map((pokemon) => ({
          name: pokemon.name,
          attack:
            pokemon.stats.find((stat) => stat.stat.name === "attack")
              ?.base_stat || 0,
        }));
      }

      // Rozkład typów
      if (statsType === "typeDistribution") {
        const typeDistribution = {};

        // Zliczanie wystąpień typów
        state.filteredPokemons.forEach((pokemon) => {
          pokemon.types.forEach((type) => {
            typeDistribution[type.type.name] =
              (typeDistribution[type.type.name] || 0) + 1;
          });
        });

        // Sortowanie typu: najpierw malejąco po liczbie, potem alfabetycznie
        const sortedTypeDistribution = Object.entries(typeDistribution)
          .sort(([typeA, countA], [typeB, countB]) => {
            // Sortowanie malejąco po liczbie wystąpień
            if (countB !== countA) {
              return countB - countA;
            }
            // Jeśli liczby są równe, sortowanie alfabetycznie
            return typeA.localeCompare(typeB);
          })
          .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {});

        stats.typeDistribution = sortedTypeDistribution;
      }

      return {
        ...state,
        stats,
      };

    case "SORT_DATA":
      const { sortBy } = action.payload;
      let sortedPokemons = [...state.filteredPokemons];

      if (sortedPokemons.length > 0) {
        if (sortBy === "id") {
          sortedPokemons.sort((a, b) => a.id - b.id);
        } else if (sortBy === "name") {
          sortedPokemons.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "attack") {
          sortedPokemons.sort((a, b) => {
            const attackA =
              a.stats.find((stat) => stat.stat.name === "attack")?.base_stat ||
              0;
            const attackB =
              b.stats.find((stat) => stat.stat.name === "attack")?.base_stat ||
              0;

            return attackB - attackA;
          });
        }
      }

      return {
        ...state,
        filteredPokemons: sortedPokemons,
      };

    case "FILTER_DATA":
      const { typeFilter, searchQuery, limit } = action.payload;
      let filteredData = [...state.filteredPokemons];

      // Filtracja tylko, gdy są dane do przetworzenia
      if (filteredData.length > 0) {
        // Filtracja po typie
        if (typeFilter.length > 0) {
          filteredData = filteredData.filter((pokemon) =>
            pokemon.types.some((t) => t.type.name === typeFilter)
          );
        }

        // Filtracja po nazwie
        if (searchQuery) {
          const lowerCaseQuery = searchQuery.toLowerCase();
          filteredData = filteredData.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(lowerCaseQuery)
          );
        }

        // Limit wyników
        if (limit) {
          filteredData = filteredData.slice(0, limit);
        }
      }

      // Dodanie wpisu do historii
      const currentDate = new Date().toLocaleString();
      const filterEntry = {
        date: currentDate,
        filters: {
          type: typeFilter || "All",
          search: searchQuery || "None",
          limit: limit || 20,
        },
      };

      const updatedHistory = [...state.history, filterEntry].slice(-5);

      return {
        ...state,
        filteredPokemons: filteredData,
        history: updatedHistory,
      };

    default:
      return state;
  }
};

export default statsReducer;
