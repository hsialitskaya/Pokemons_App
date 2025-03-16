export async function getAllPokemons() {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.results; // Zwraca listę Pokémonów
  } catch (error) {
    console.error("Błąd podczas pobierania listy Pokémonów:", error);
    return [];
  }
}

// Pobieranie szczegółów pojedynczego Pokemona
export async function getPokemonDetails(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Błąd podczas pobierania szczegółów Pokemona:", error);
    return null;
  }
}
