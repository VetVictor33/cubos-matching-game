import Logo from './assets/logo.svg'
import cards from './database/cards';
import CardBack from './assets/card-back.png'
import Congrats from './assets/congrats.png'
import { useState } from 'react'
import './App.css'

function gambit(cards) {
  let index = cards.length;

  while (index) {
    const randomIndex = Math.floor(Math.random() * index--);
    [cards[index], cards[randomIndex]] = [cards[randomIndex], cards[index]];
  }
  /*
  for (let index = cards.length; index; index--) {

    const randomIndex = Math.floor(Math.random() * index);

    const card = cards[index - 1];

    cards[index - 1] = cards[randomIndex];

    cards[randomIndex] = card;
  }
  */
  return cards
}

export default function App() {
  const [cardsArray, setCards] = useState(gambit(cards));
  const [isFirstCard, setIsFirstCard] = useState(true);
  const [secondCard, setSecondCard] = useState(undefined);
  const [locked, setLocked] = useState(false);



  function handleCardClick(id) {
    if (locked) return
    const localCards = [...cardsArray];
    const card = localCards.find((card) => card.id === id);
    if (card.turned) return
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
    if (card.slug === secondCard.slug) {
      const firstCardIndex = localCards.findIndex((localCard) => localCard.id === card.id);
      localCards.splice(firstCardIndex, 1);
      const secondCardIndex = localCards.findIndex((localCard) => localCard.id === secondCard.id);
      localCards.splice(secondCardIndex, 1);
      setTimeout(() => {
        setCards(localCards)
        setLocked(false);
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
  }

  return (
    <div className='App'>
      <aside>
        <img src={Logo} alt='logo' />
        <button onClick={() => reset()}>Reset</button>
      </aside>
      <main>
        {!!cardsArray.length && cardsArray.map((card) => {
          const src = card.turned ? card.image : CardBack;
          return (
            <img onClick={() => handleCardClick(card.id)} key={card.id} src={src} alt={card.slug} className='card' />
          )
        })}
        {!cardsArray.length && <div className='congrats'> < img src={Congrats} /></div>}
      </main>
    </div>
  );
}
