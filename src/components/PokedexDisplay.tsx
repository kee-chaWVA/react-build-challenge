// src/components/PokedexDisplay.tsx
import { useEffect, useRef } from "react";
import { capitalize } from "../shared/utils/stringUtils";
import { useTypingEffect } from "../hooks/useTypingEffect";
import Button from "../components/Button";
import "../styles/PokedexDisplay.css";

type PokedexDisplayProps = {
  pokemon: any;
  isOpen: boolean;
  onClose: () => void;
};

export default function PokedexDisplay({
  pokemon,
  isOpen,
  onClose,
}: PokedexDisplayProps) {
  /* ------------------------------
     Typing data
  ------------------------------ */
  const lines = pokemon
    ? [
        `Name: ${capitalize(pokemon.name)}`,
        `Types: ${pokemon.types
          .map((t: any) => capitalize(t.type.name))
          .join(", ")}`,
        `Height: ${pokemon.height / 10} m`,
        `Weight: ${pokemon.weight / 10} kg`,
        `Abilities: ${pokemon.abilities
          .map((a: any) => capitalize(a.ability.name))
          .join(", ")}`,
      ]
    : [];

  const { visibleLines, currentLine } = useTypingEffect(lines, {
    start: isOpen && Boolean(pokemon),
    charDelayMs: 28,
    lineDelayMs: 180,
  });

  /* ------------------------------
     Audio autoplay
  ------------------------------ */
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (!pokemon?.cries?.latest) return;

    audioRef.current = new Audio(pokemon.cries.latest);
    audioRef.current.volume = 0.6;

    audioRef.current.play().catch(() => {
      // autoplay may be blocked; silent fail is expected
    });

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [isOpen, pokemon?.cries?.latest]);

  /* ------------------------------
     Render
  ------------------------------ */
  return (
    <aside className={`pokedex ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
      <header className="pokedex-header">
        <span>Pokédex</span>
        <button
          type="button"
          className="pokedex-close"
          onClick={onClose}
        >
          Close
        </button>
      </header>

      {/* Image */}
      <div className="pokedex-image">
        {pokemon?.sprites?.other?.["official-artwork"]?.front_default ? (
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
          />
        ) : (
          <div style={{ padding: 16 }}>Awaiting Pokémon…</div>
        )}
      </div>

      {/* Manual cry button */}
      {pokemon?.cries?.latest && (
        <Button
          variant="secondary"
          className="pokedex-button-flat"
          onClick={() => {
            const audio = new Audio(pokemon.cries.latest);
            audio.volume = 0.6;
            audio.play().catch(() => {});
          }}
        >
          🔊 Play cry
        </Button>
      )}

      {/* Typing terminal */}
      <div className="pokedex-terminal">
        {pokemon ? (
          <>
            {visibleLines.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
            {currentLine && (
              <div className="typing-cursor">{currentLine}</div>
            )}
          </>
        ) : (
          <div>Search a Pokémon to begin.</div>
        )}
      </div>
    </aside>
  );
}