import { useState, useEffect, useRef } from 'react';
import styles from "@/styles/Home.module.css";
import Image from 'next/image';
import Head from 'next/head';

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

type PokemonState = {
	word: string;
	image: string;
};

const Home: React.FC = () => {
	const [typedWord, setTypedWord] = useState<string>("");
	const [score, setScore] = useState<number>(0);
	const [message, setMessage] = useState<string>("Please start the game.");
	const [timeLeft, setTimeLeft] = useState<number>(60);
	const [isGameActive, setIsGameActive] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [previousWord, setPreviousWord] = useState<string>("");
	const [pokemon, setPokemon] = useState<PokemonState>({ word: "", image: "" });

	const startGame = () => {
		setScore(0);
		setMessage("");
		setIsGameActive(true);
	};

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
			
			const randomWord = data.name !== previousWord ? data.name : "";
			const officialArtwork = data.sprites.other['official-artwork'].front_default;
			const image = officialArtwork ? officialArtwork : data.sprites.front_default;

			setPreviousWord(randomWord);
			setPokemon({ word: randomWord, image });

		} catch (error) {
			setMessage("Please try again.");
		}
	};	
	
	useEffect(() => {
		fetchWord();
	}, []);

	useEffect(() => {
		if (pokemon.word === typedWord) {
			setScore(prevScore => prevScore + 10);
			fetchWord();
			setTypedWord("");
		}
	}, [typedWord, pokemon.word]);

	useEffect(() => {
		setScore(0);
	}, []);

	return (
		<>
		<Head>
			<title>Pokemon Typing Game</title>
		</Head>
		<div className={styles.wrapper}>
			<header>
				<div className={styles.headLeft}>
					<Image src="/25.webp" alt="Pikachu" width={90} height={90} priority />
					<h1>Pokemon Typing Game</h1>
				</div>
				<div className={styles.headRight}>
					<p>Time:<span>{timeLeft}</span></p>
					<p>Score:<span>{score}</span></p>
				</div>
			</header>
			<main>
				<div className={styles.typeBox}>
					<p className={styles.message}>{message}</p>
					<p><img src={pokemon.image} alt={pokemon.word} width="130" height="130" /></p>
					<p className={styles.currentWord}>{pokemon.word}</p>
					{isGameActive ? (
						<input 
							ref={inputRef}
							type="text"
							value={typedWord}
							onChange={(e) => {
								setTypedWord(e.target.value);
							}}
						/>
					) : null}
					<div className={styles.btnBox}>
						<button 
							onClick={startGame} 
							className={styles.startGameBtn} 
							disabled={isGameActive || timeLeft === 0}
						>
							Start Game
						</button>
						<button
							onClick={resetGame}
							className={styles.resetGameBtn}
							disabled={timeLeft === 60}
						>
							Reset Game
						</button>
					</div>
				</div>
			</main>
		</div>
		</>
	);
}

export default Home;
