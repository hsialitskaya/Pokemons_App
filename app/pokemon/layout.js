import { StatsProvider } from "../components/StatsProvider";
export default function PokemonLayout({ children }) {
  return (
    <StatsProvider>
      <section>
        <div>{children}</div>
      </section>
    </StatsProvider>
  );
}
