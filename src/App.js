import { useEffect, useState } from "react";
import "./App.css";
import SingleCard from "./components/SingleCard";
import confetti from "https://cdn.skypack.dev/canvas-confetti";
import canvasConfetti from "https://cdn.skypack.dev/canvas-confetti";

const cardImages = [
  { src: "/img/helmet-1.png", matched: false },
  { src: "/img/potion-1.png", matched: false },
  { src: "/img/ring-1.png", matched: false },
  { src: "/img/scroll-1.png", matched: false },
  { src: "/img/shield-1.png", matched: false },
  { src: "/img/sword-1.png", matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [victory, setVictory] = useState(false);
  //shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setVictory(false);
  };

  //handle a choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  //compare two cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 600);
      }
    }
  }, [choiceOne, choiceTwo]);
  //reset turn
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
    let count = 2;
    for (const item in cards) {
      if (cards[item].matched === true) {
        count++;
        if (count === cards.length) {
          setTimeout(() => {
            setVictory(true);
            canvasConfetti();
            canvasConfetti();
          }, 700);
        }
      }
    }
  };
  //start new game outo
  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className="App">
      <h1>Magic Match </h1>

      <button onClick={shuffleCards}>New Game</button>
      {victory ? (
        <h1 className="victory">
          Victory! <br /> you used {turns} turns
        </h1>
      ) : (
        <div className="card-grid">
          {cards.map((card) => (
            <SingleCard
              card={card}
              key={card.id}
              handleChoice={handleChoice}
              flipped={card === choiceOne || card === choiceTwo || card.matched}
              disabled={disabled}
            />
          ))}
        </div>
      )}
      <p>Turns: {turns}</p>
    </div>
  );
}

export default App;
