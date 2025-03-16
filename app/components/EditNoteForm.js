import React, { useState, useEffect } from "react";

const EditNoteForm = ({ note, onSave, goBack }) => {
  const [formData, setFormData] = useState({
    tacticName: "",
    strategy: "",
    effectiveness: 1,
    conditions: "",
    trainingDate: "",
    opponents: [],
  });

  const [errors, setErrors] = useState({});

  // Ładowanie istniejącej notatki do formularza
  useEffect(() => {
    if (note) {
      setFormData({
        tacticName: note.tacticName || "",
        strategy: note.strategy || "",
        effectiveness: note.effectiveness || 1,
        conditions: note.conditions || "",
        trainingDate: note.trainingDate || "",
        opponents: note.opponents || [],
      });
    }
  }, [note]);

  // Walidacja formularza
  const validate = () => {
    const newErrors = {};

    if (!formData.tacticName) {
      newErrors.tacticName = "Nazwa taktyki jest wymagana";
    } else if (formData.tacticName.length < 5) {
      newErrors.tacticName = "Minimalna długość to 5 znaków";
    } else if (formData.tacticName.length > 50) {
      newErrors.tacticName = "Maksymalna długość to 50 znaków";
    }

    if (!formData.strategy) {
      newErrors.strategy = "Opis strategii jest wymagany";
    } else if (formData.strategy.length < 10) {
      newErrors.strategy = "Opis strategii musi mieć co najmniej 10 znaków";
    }

    if (!formData.effectiveness) {
      newErrors.effectiveness = "Skuteczność jest wymagana";
    } else if (formData.effectiveness < 1 || formData.effectiveness > 5) {
      newErrors.effectiveness = "Skuteczność musi być w zakresie od 1 do 5";
    }

    if (formData.conditions && formData.conditions.length < 10) {
      newErrors.conditions = "Warunki użycia muszą mieć co najmniej 10 znaków";
    }

    if (!formData.trainingDate) {
      newErrors.trainingDate = "Data treningu jest wymagana";
    } else if (new Date(formData.trainingDate) > new Date()) {
      newErrors.trainingDate = "Data treningu nie może być w przyszłości";
    }

    return newErrors;
  };

  // Obsługa zmiany wartości formularza
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Obsługa wysłania formularza
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate(); // Sprawdzamy walidację
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const updatedNote = {
        ...formData,
        pokemonId: note.pokemonId,
        id: note.id,
        updatedAt: new Date().toISOString(),
      };

      onSave(updatedNote);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nazwa taktyki:</label>
        <input
          name="tacticName"
          value={formData.tacticName}
          onChange={handleChange}
          className={errors.tacticName ? "error-input" : ""}
        />
        {errors.tacticName && (
          <span className="error">{errors.tacticName}</span>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <label>Opis strategii:</label>
        <textarea
          name="strategy"
          value={formData.strategy}
          onChange={handleChange}
          className={errors.strategy ? "error-input" : ""}
        />
        {errors.strategy && <span className="error">{errors.strategy}</span>}
      </div>
      <div>
        <label>Skuteczność:</label>
        <select
          name="effectiveness"
          value={formData.effectiveness}
          onChange={handleChange}
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        {errors.effectiveness && (
          <span className="error">{errors.effectiveness}</span>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <label>Warunki użycia:</label>
        <textarea
          name="conditions"
          value={formData.conditions}
          onChange={handleChange}
          className={errors.conditions ? "error-input" : ""}
        />
        {errors.conditions && (
          <span className="error">{errors.conditions}</span>
        )}
      </div>
      <div>
        <label>Data treningu:</label>
        <input
          name="trainingDate"
          type="date"
          value={formData.trainingDate}
          onChange={handleChange}
          className={errors.trainingDate ? "error-input" : ""}
        />
        {errors.trainingDate && (
          <span className="error">{errors.trainingDate}</span>
        )}
      </div>
      <div>
        <label>Przeciwnicy:</label>
        <div className={errors.opponents ? "error-input" : ""}>
          {[
            "fire",
            "water",
            "grass",
            "electric",
            "ground",
            "normal",
            "flying",
            "poison",
            "rock",
            "bug",
            "ghost",
            "steel",
            "psychic",
            "ice",
            "dragon",
            "dark",
            "fairy",
          ].map((type) => (
            <div key={type}>
              <input
                type="checkbox"
                id={type}
                name="opponents"
                value={type}
                checked={formData.opponents.includes(type)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData((prevState) => ({
                      ...prevState,
                      opponents: [...prevState.opponents, e.target.value],
                    }));
                  } else {
                    setFormData((prevState) => ({
                      ...prevState,
                      opponents: prevState.opponents.filter(
                        (opponent) => opponent !== e.target.value
                      ),
                    }));
                  }
                }}
              />
              <label htmlFor={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            </div>
          ))}
        </div>
        {errors.opponents && <span className="error">{errors.opponents}</span>}
      </div>
      <button type="submit">Zapisz zmiany</button>
      <button type="button" onClick={goBack}>
        Wróć
      </button>
    </form>
  );
};

export default EditNoteForm;
