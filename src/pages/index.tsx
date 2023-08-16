import { useState, useEffect, useRef } from 'react';
import styles from "@/styles/Home.module.css";

type PokemonData = {
    name: string;
    sprites: {
        front_default: string;
        other: {
            'official-artwork': {
                front_default: string;
            }
        }
    };
};

const Home: React.FC = () => {
	const [currentWord, setCurrentWord] = useState<string>("");
	const [typedWord, setTypedWord] = useState<string>("");
	const [score, setScore] = useState<number>(0);
	const [message, setMessage] = useState<string>("Please start the game.");
	const [timeLeft, setTimeLeft] = useState<number>(60);
	const [isGameActive, setIsGameActive] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [previousWord, setPreviousWord] = useState<string>("");
	const [pokemonImage, setPokemonImage] = useState<string>("");
	const [pikachuImage, setPikachuImage] = useState<string>("");



	const startGame = () => {
		setScore(0);
		setMessage("");
		setIsGameActive(true);
	}

	const resetGame = () => {
		setIsGameActive(false);
		setTimeLeft(60);
		setScore(0);
		setTypedWord("");
		setMessage("Reset.");
		fetchWord();
	};

	useEffect(() => {
		if (isGameActive && inputRef.current) {
			setMessage("Please type this Pokemon.");
			inputRef.current.focus();
		}
	}, [isGameActive]);

	useEffect(() => {
		if (isGameActive && timeLeft > 0) {
			const timerId = setTimeout(() => {
				setTimeLeft(prevTime => prevTime - 1);
			}, 1000);
			return () => clearTimeout(timerId);
		} else if (timeLeft === 0) {
			setIsGameActive(false);
			setMessage("Time up!");
		}
	}, [timeLeft, isGameActive]);

	const fetchWord = async () => {
		try {
			const randomId = Math.floor(Math.random() * 800) + 1;
			const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
			const data: PokemonData = await response.json();
			
			let randomWord = data.name;
			
			while (randomWord === previousWord) {
				randomWord = data.name;
			}
	
			setPreviousWord(randomWord); 
			setCurrentWord(randomWord);
			
			const officialArtwork = data.sprites.other['official-artwork'].front_default;
			if (officialArtwork) {
				setPokemonImage(officialArtwork);
			} else {
				setPokemonImage(data.sprites.front_default);
			}
	
		} catch (error) {
			setMessage("Please try again.");
		}
	}	
	

	useEffect(() => {
		fetchWord();
	}, []);

	useEffect(() => {
		if (currentWord === typedWord) {
			setScore(prevScore => prevScore + 1);
			fetchWord();
			setTypedWord("");
		}
	}, [typedWord, currentWord]);

	useEffect(() => {
		const fetchPikachu = async () => {
			try {
				const response = await fetch('https://pokeapi.co/api/v2/pokemon/25');
				const data = await response.json();
				setPikachuImage(data.sprites.other['official-artwork'].front_default);
			} catch (error) {
				console.error("Error fetching Pikachu data:", error);
			}
		}

		fetchPikachu();
	}, []);

	

	useEffect(() => {
		setScore(0);
	}, []);

	return (
        <div>
			<img src={pikachuImage} alt="Pikachu" width="90" height="90" />
            <h1>Pokemon Typing Game</h1>
            <div className={styles.typeBox}>
                {isGameActive ? (
                    <>
                        <p className={styles.message}>{message}</p>
                        <p><img src={pokemonImage} alt={currentWord} width="130" height="130" /></p>
                        <p className={styles.currentWord}>{currentWord}</p>
                        <input 
                            ref={inputRef}
                            type="text"
                            value={typedWord}
                            onChange={(e) => {
                                setTypedWord(e.target.value);
                            }}
                        />
                    </>
                ) : (
                    <>
                        <p className={styles.message}>{message}</p>
                        <button onClick={startGame} className={styles.startGame} disabled={timeLeft == 0}>
                        Start Game
                        </button>
                    </>
                )}
                <button onClick={resetGame} disabled={timeLeft == 60}>Reset Game</button>
            </div>
            <p>Remaining time: {timeLeft} seconds</p>
            <p>Score: {score}</p>
        </div>
	);
}

export default Home;
