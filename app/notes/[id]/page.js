"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import AddNoteForm from "../../components/AddNoteForm";
import EditNoteForm from "../../components/EditNoteForm";
import { getPokemonDetails } from "../../services/pokemonService";
import Breadcrumbs from "../../components/Breadcrumbs";

const NotesPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [notes, setNotes] = useState([]);
  const [pokemonNotes, setPokemonNotes] = useState([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // Przechowywanie edytowanej notatki
  const [errorMessage, setErrorMessage] = useState("");
  const [errorPokemon, setErrorPokemon] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Stan do kontrolowania wyświetlania komunikatu o sukcesie
  const [successMessage, setSuccessMessage] = useState(""); // Komunikat o sukcesie
  const [loading, setLoading] = useState(false);
  const [pokemonName, setPokemonName] = useState(null);
  const [breadcrumbsPath, setBreadcrumbsPath] = useState([]);

  useEffect(() => {
    if (!id || Number(id) < 1) {
      setErrorPokemon("Id of Pokémon can't be lower than 1 ");
      return;
    }

    const fetchPokemonName = async () => {
      try {
        setLoading(true);
        const details = await getPokemonDetails(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );

        if (!details || !details.name) {
          throw new Error("Pokemon not found");
        }

        setPokemonName(details.name);

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
            { name: `Notes of ${details.name}`, url: `/notes/${details.id}` },
          ]);
        } else {
          setBreadcrumbsPath([
            { name: "Home", url: "/" },
            { name: "Favorites", url: "/favorites" },
            { name: `Notes of ${details.name}`, url: `/notes/${details.id}` },
          ]);
        }
      } catch (error) {
        console.error("Błąd podczas pobierania listy Pokémonów:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonName();
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(savedNotes);
    setPokemonNotes(savedNotes.filter((note) => note.pokemonId === id));
  }, [id]);

  const handleSaveNote = (note) => {
    const isTacticNameExist = pokemonNotes.some(
      (existingNote) => existingNote.tacticName === note.tacticName
    );

    if (isTacticNameExist) {
      setErrorMessage("Notatka z tą nazwą taktyki już istnieje!");
      return;
    }

    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    setPokemonNotes(updatedNotes.filter((n) => n.pokemonId === note.pokemonId));
    localStorage.setItem("notes", JSON.stringify(updatedNotes));

    // Wyświetlenie komunikatu o sukcesie
    setShowSuccessMessage(true);
    setSuccessMessage("Notatka została dodana!");

    setIsAddingNote(false);
    setErrorMessage("");

    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  const handleSaveEdit = (updatedNote) => {
    const updatedNotes = notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    );
    setNotes(updatedNotes);
    setPokemonNotes(updatedNotes.filter((n) => n.pokemonId === id));
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setEditingNote(null);

    // Wyświetlenie komunikatu o sukcesie
    setShowSuccessMessage(true);
    setSuccessMessage("Notatka została zaktualizowana!");

    setIsAddingNote(false);
    setErrorMessage("");

    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  const deleteNote = (noteId) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);
    setPokemonNotes(updatedNotes.filter((n) => n.pokemonId === id));
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  return (
    <div className="note_page">
      {showSuccessMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "50%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "lightgreen",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          {successMessage}
        </div>
      )}
      {errorPokemon && <p>{errorPokemon}</p>}

      {!errorPokemon && (
        <>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <Breadcrumbs path={breadcrumbsPath} />
              <h1>Notatki dla Pokémona {pokemonName} </h1>

              {!isAddingNote && pokemonNotes.length === 0 && (
                <p>Brak notatek dla tego Pokémona</p>
              )}

              {!isAddingNote && !editingNote && (
                <button onClick={() => setIsAddingNote(true)}>
                  Dodaj nową notatkę treningową
                </button>
              )}

              {isAddingNote ? (
                <>
                  {errorMessage && (
                    <p style={{ color: "red" }}>{errorMessage}</p>
                  )}
                  <AddNoteForm
                    onSave={handleSaveNote}
                    pokemonId={id}
                    goBack={() => {
                      setIsAddingNote(false), setErrorMessage("");
                    }}
                  />
                </>
              ) : editingNote ? (
                <EditNoteForm
                  note={editingNote} // Przekazanie edytowanej notatki
                  onSave={handleSaveEdit}
                  goBack={() => setEditingNote(null)}
                />
              ) : (
                pokemonNotes.length > 0 && (
                  <>
                    <div>
                      <button
                        onClick={() =>
                          setPokemonNotes(
                            [...pokemonNotes].sort(
                              (a, b) =>
                                new Date(a.trainingDate) -
                                new Date(b.trainingDate)
                            )
                          )
                        }
                      >
                        Sortuj rosnąco
                      </button>
                      <button
                        onClick={() =>
                          setPokemonNotes(
                            [...pokemonNotes].sort(
                              (a, b) =>
                                new Date(b.trainingDate) -
                                new Date(a.trainingDate)
                            )
                          )
                        }
                      >
                        Sortuj malejąco
                      </button>
                    </div>
                    <ul>
                      {pokemonNotes.map((note) => (
                        <li key={note.id}>
                          <h3>{note.tacticName}</h3>
                          <p>Opis strategii: {note.strategy}</p>
                          <p>Skuteczność: {note.effectiveness}</p>
                          <p>Warunki użycia: {note.conditions}</p>
                          <p>
                            Data treningu:{" "}
                            {new Date(note.trainingDate).toLocaleDateString()}
                          </p>
                          <p>Przeciwnicy: {note.opponents.join(", ")}</p>
                          <p>
                            Data utworzeia:{" "}
                            {new Date(note.createdAt).toLocaleDateString()}
                          </p>
                          <p>
                            Ostatnia modyfikacja:{" "}
                            {new Date(note.updatedAt).toLocaleDateString()}
                          </p>
                          <button onClick={() => setEditingNote(note)}>
                            Edytuj
                          </button>
                          <button onClick={() => deleteNote(note.id)}>
                            Usuń
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default NotesPage;
