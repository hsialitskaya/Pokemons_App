"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navigation() {
  const [currentParams, setCurrentParams] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    // Pobieramy filtry z localStorage
    const storedFilters = JSON.parse(localStorage.getItem("filters")) || {};
    const params = new URLSearchParams(searchParams.toString());

    if (storedFilters.type) {
      params.set("type", storedFilters.type);
    }
    if (storedFilters.limit) {
      params.set("limit", storedFilters.limit);
    }
    if (storedFilters.search) {
      params.set("search", storedFilters.search);
    }

    setCurrentParams(params.toString());
  }, [searchParams]);

  return (
    <nav id="navigation">
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href={`/pokemon?${currentParams}`}>Pokémon</Link>
        </li>
        <li>
          <Link href="/favorites">Favorites</Link>
        </li>
        <li>
          <Link href="/compare">Porównanie</Link>
        </li>
      </ul>
    </nav>
  );
}
