"use client";
import { createContext, useState, useEffect } from "react";

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    // Sprawdzenie, czy środowisko to przeglądarka (dostępność localStorage)
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        // Odczyt danych z localStorage
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
          setValue(JSON.parse(storedValue));
        } else {
          setValue(initialValue);
        }
      } catch (error) {
        console.error("Error reading localStorage:", error);
        setValue(initialValue);
      }
    }
  }, [key, initialValue]);

  useEffect(() => {
    // Zapis do localStorage, tylko po stronie klienta
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }
    }
  }, [key, value]);

  return [value, setValue];
};

// Tworzenie kontekstu dla preferencji z domyślnymi wartościami
export const StatsContext = createContext({
  numberFormat: "percentage",
  sortBy: "date",
  viewType: "table",
  updatePreferences: () => {},
});

export const StatsProvider = ({ children }) => {
  // Używanie hooków wewnątrz komponentu
  const [numberFormat, setNumberFormat] = useLocalStorage(
    "numberFormat",
    "percentage"
  );
  const [sortBy, setSortBy] = useLocalStorage("sortBy", "date");
  const [viewType, setViewType] = useLocalStorage("viewType", "table");

  // Funkcja do aktualizacji preferencji
  const update = (key, value) => {
    if (key === "numberFormat") {
      setNumberFormat(value);
    } else if (key === "sortBy") {
      setSortBy(value);
    } else if (key === "viewType") {
      setViewType(value);
    }
  };

  // Zwracanie kontekstu z preferencjami i funkcją aktualizacji
  return (
    <StatsContext.Provider
      value={{
        numberFormat,
        sortBy,
        viewType,
        updatePreferences: update,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};
