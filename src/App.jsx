import Logo from './assets/logo.svg'
import cards from './database/cards';
import CardBack from './assets/card-back.png'
import Congrats from './assets/congrats.png'
import { useEffect, useRef, useState } from 'react'
import './App.css'
import Unclickable from './assets/unclickable.svg'

function gambit(cards) {
  let index = cards.length;

  while (index) {
    const randomIndex = Math.floor(Math.random() * index--);
    [cards[index], cards[randomIndex]] = [cards[randomIndex], cards[index]];
  }
  return cards
}

const unClickebleCard = { slug: 'unclickable', image: Unclickable, turned: true }

export default function App() {
  const [cardsArray, setCards] = useState(gambit(cards));
  const [isFirstCard, setIsFirstCard] = useState(true);
  const [secondCard, setSecondCard] = useState(undefined);
  const [locked, setLocked] = useState(false);
  const [count, setCount] = useState(0);
  const [tries, setTries] = useState(0);
  const [win, setWin] = useState(false);
  const [totalWins, setTotalWins] = useState(0);

  const cardsRef = useRef(null);

  function handleCardClick(e, id) {
    if (locked) return
    const localCards = [...cardsArray];
    const card = localCards.find((card) => card.id === id);
    if (card.turned || card.slug === 'unclickable') return
    setLocked(true);
    card.turned = !card.turned;
    if (isFirstCard) {
      setIsFirstCard(false);
      setSecondCard(card);
      setCards(localCards);
      setLocked(false);
      return
    }
    setIsFirstCard(true);
    setTries(tries + 1);
    let localCount = count;
    if (card.slug === secondCard.slug) {
      const firstCardIndex = localCards.findIndex((localCard) => localCard.id === card.id);
      localCards.splice(firstCardIndex, 1, { ...unClickebleCard, id: Math.random() });
      const secondCardIndex = localCards.findIndex((localCard) => localCard.id === secondCard.id);
      localCards.splice(secondCardIndex, 1, { ...unClickebleCard, id: Math.random() });
      setTimeout(() => {
        setCards(localCards)
        setLocked(false);
        localCount++;
        setCount(localCount);
        if (localCount === (cards.length / 2)) {
          setWin(true);
          setTotalWins(totalWins + 1);
        };
        console.log(`Local count: ${localCount}, count: ${count}`)
      }, 1000);
      return
    }
    setTimeout(() => {
      card.turned = false;
      secondCard.turned = false;
      setCards(localCards);
      setLocked(false);
    }, 1000);
  };

  function reset() {
    if (locked) return;
    const resetCards = [...cards];
    resetCards.forEach(card => card.turned = false);
    setCards(resetCards);
    setSecondCard(undefined);
    setIsFirstCard(true);
    setCount(0);
    setTries(0);
    setWin(false);
  }

  return (
    <div className='App'>
      <aside>
        <img src={Logo} alt='logo' />
        <div className='score'>
          <div>
            <h1>Matches:</h1>
            <p>{count}</p>
            <h1>Tries:</h1>
            <p>{tries}</p>
          </div>
          <div>
            <h1>Wins:</h1>
            <p>{totalWins}</p>
          </div>
        </div>
        <button onClick={() => reset()}>Reset</button>
      </aside>
      <main ref={cardsRef}>
        {!win ? cardsArray.map((card) => {
          const src = card.turned ? card.image : CardBack;
          return (
            <img onClick={(e) => handleCardClick(e, card.id)} key={card.id} src={src} alt={card.slug} className={`card ${card.slug} ${card.id}`} />
          )
        })
          : <div className='congrats'> < img src={Congrats} /></div>}
      </main>
    </div>
  );
}
