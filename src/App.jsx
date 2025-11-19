import React, { useEffect, useState } from "react";
import GameHeader from "./components/GameHeader.jsx";
import { Card } from "./components/Card.jsx";

const cardValues = [
    "😂","👹","👺","🤡","👍","😎","😍","👮‍♀️",
    "😂","👹","👺","🤡","👍","😎","😍","👮‍♀️"
];

const App = () => {
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [isLocked, setIsLocked] = useState(false);

    const initializeGame = () => {
        // Shuffle array
        const shuffled = [...cardValues]
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map((item, index) => ({
                id: index,
                value: item.value,
                isFlipped: false,
                isMatched: false,
            }));

        setCards(shuffled);
        setFlippedCards([]);
        setScore(0);
        setMoves(0);
    };

    useEffect(() => {
        initializeGame();
    }, []);

    const handleCardClick = (card) => {
        if (card.isFlipped || card.isMatched || isLocked) {
            return
        }

        // Flip card
        const updatedCards = cards.map(c =>
            c.id === card.id ? { ...c, isFlipped: true } : c
        );
        setCards(updatedCards);

        const newFlips = [...flippedCards, card.id];
        setFlippedCards(newFlips);

        // If two cards are flipped, check match
        if (newFlips.length === 2) {
            setIsLocked(true);
            const [id1, id2] = newFlips;
            const first = updatedCards[id1];
            const second = updatedCards[id2];

            if (first.value === second.value) {
                // Mark matched

                //Add 4 points to the score after every match
                setScore(prev => prev + 5)

                setCards(prev =>
                    prev.map(c =>
                        c.id === id1 || c.id === id2
                            ? { ...c, isMatched: true }
                            : c
                    )
                );
                setFlippedCards([]); // reset
            } else {
                // Unflip after delay
                setTimeout(() => {
                    setCards(prev =>
                        prev.map(c =>
                            c.id === id1 || c.id === id2
                                ? { ...c, isFlipped: false }
                                : c
                        )
                    );
                    setFlippedCards([]);
                    setIsLocked(false);
                }, 400);
            }
            //Add one after every move to the display
            setMoves(prev => prev + 1)

        }
    };

    return (
        <div className="app">
            <GameHeader score={score} moves={moves} onRest={initializeGame} />

            <div className="cards-grid">
                {cards.map((card) => (
                    <Card key={card.id} card={card} onClick={() => handleCardClick(card)} />
                ))}
            </div>
        </div>
    );
};

export default App;