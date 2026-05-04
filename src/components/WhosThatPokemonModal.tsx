import { useRef, useEffect, useState } from "react"
import type { PokemonListItem } from "../queries/pokemonApi"
import Button from "./Button"
import '../styles/WhosThatPokemonModal.css'
import { capitalize } from "../shared/utils/stringUtils"

type WhosThatPokemonModalProps = {
  allPokemon: PokemonListItem[];
  onIncorrectGuess: (pokemonName: string) => void;
  onClose: () => void;
  onPlayAgain: () => void;
}

export default function WhosThatPokemonModal({
  allPokemon,
  onIncorrectGuess,
  onClose,
  onPlayAgain
}: WhosThatPokemonModalProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const initCorrectPokemon = () => {
    const index = Math.floor(Math.random() * allPokemon.length)
    return allPokemon[index]
  }
  const [ correctPokemon ] = useState(initCorrectPokemon)
  const [choices] = useState(() => {
    const decoys = allPokemon
      .filter(p => p.name !== correctPokemon.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    return [correctPokemon, ...decoys].sort(
      () => 0.5 - Math.random()
    );
  });
  const [feedback, setFeedback] = useState<string | undefined>(undefined);
  const [revealed, setRevealed] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  // Start theme when modal mounts

  useEffect(() => {
    const audio = new Audio("/audio/wtp-soundclip.mp3");
    audio.volume = 0.4;
    audio
      .play()
      .catch(() => {
      });
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  const feedbackTimeoutRef = useRef<number | null>(null);
  
  const getImageUrl = (pokemon: PokemonListItem): string | undefined => {
    const match = pokemon.url.match(/\/pokemon\/(\d+)\//);
    if (match === null) {
      return undefined;
    }
    const pokemonId = match[1];
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  };

  const imageUrl = getImageUrl(correctPokemon)
  
  const handleGuess = (name: string) => {
    if (feedbackTimeoutRef.current) {
      window.clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
    if(name === correctPokemon.name) {
      setFeedback("Correct! 🎉");
      setRevealed(true);
    } else {
      setFeedback("Nope! Try again!");
      setShakeKey(k => k + 1)
      onIncorrectGuess(name);
      
      feedbackTimeoutRef.current = window.setTimeout(() => {
        setFeedback(undefined);
        feedbackTimeoutRef.current = null;
      }, 2000);
    }
  }

  const normalizName = (name: string) => {
    return name
      .split("-")
      .map(word => capitalize(word))
      .join(" ")
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div
        key={shakeKey}
        className={`wtp-card ${shakeKey > 0 ? "shake" : ""}`}
      >
        <header className="wtp-header">
          <h2 className="wtp-title">
            {!revealed && "Who's that Pokémon?"}
          </h2>
          <button className="wtp-close" onClick={onClose}>✕</button>
        </header>
        <div className="wtp-stage">
          {revealed && (
            <div className="reveal-title">
              {normalizName(correctPokemon.name)}
            </div>
          )}
          {!revealed && (
            <img
              src="/pokemon-question-mark.png"
              alt=""
              className="wtp-question"
            />
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt={revealed ? capitalize(correctPokemon.name) : "Pokémon silhouette"}
              className={`wtp-pokemon ${revealed ? "revealed" : "silhouette"}`}
            />
          )}
          {!revealed && (
            <img
              src="/pokemon-logo.png"
              alt=""
              className="wtp-logo"
            />
          )}
        </div>
        {feedback && (
          <div className="wtp-feedback" aria-live="polite">
            {feedback}
          </div>
        )}
        {!revealed && (
          <footer className="wtp-footer">
            <div className="wtp-choices">
              {choices.map(p => (
                <Button
                  key={p.name}
                  className="wtp-choice"
                  onClick={() => handleGuess(p.name)}
                >
                  {normalizName(p.name)}
                </Button>
              ))}
            </div>
          </footer>
        )}
        {revealed && (
        <footer className="wtp-footer">
          <div className="wtp-choices">
            <Button
              className="wtp-choice"
              onClick={() => {
                onPlayAgain();
              }}
            >
              Play again
            </Button>

            <Button
              variant="secondary"
              className="wtp-choice"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </footer>
      )}
      </div>
    </div>
  );
}