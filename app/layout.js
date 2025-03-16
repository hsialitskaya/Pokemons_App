import Navigation from "./components/Navigation";
import "./styles/global.css";

export const metadata = {
  title: "Pokemon GO App",
  description: "Explore and manage your Pokémon!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
