import { useState, useEffect, useRef } from 'react';
import styles from "@/styles/Home.module.css";

type WordData = {
	words: string[];
};

const Home: React.FC = () => {
	const [currentWord, setCurrentWord] = useState<string>("");
	const [typedWord, setTypedWord] = useState<string>("");
	const [score, setScore] = useState<number>(0);
	const [message, setMessage] = useState<string>("Please start the game.");
	const [timeLeft, setTimeLeft] = useState<number>(10);
	const [isGameActive, setIsGameActive] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [previousWord, setPreviousWord] = useState<string>("");


	const startGame = () => {
		setScore(0);
		setMessage("");
		setIsGameActive(true);
	}

	const resetGame = () => {
		setIsGameActive(false);
		setTimeLeft(10);
		setScore(0);
		setTypedWord("");
		setMessage("Reset.");
		fetchWord();
	};

	useEffect(() => {
		if (isGameActive && inputRef.current) {
			setMessage("Please type this word.");
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
			const response = await fetch('/words.json');
			const data: WordData = await response.json();
			
			let randomWord = data.words[Math.floor(Math.random() * data.words.length)];
			
			// 2回連続で同じ単語が出ないようにするためのループ
			while (randomWord === previousWord && data.words.length > 1) {
				randomWord = data.words[Math.floor(Math.random() * data.words.length)];
			}
	
			setPreviousWord(randomWord); // 前回の単語を更新
			setCurrentWord(randomWord);
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
	

	// ページが読み込まれるたびにスコアをリセット
	useEffect(() => {
		setScore(0);
	}, []);

	return (
		<div>
			<h1>Typing Game</h1>
			<div className={styles.typeBox}>
				{isGameActive ? (
					<>
						<p className={styles.message}>{message}</p>
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
				<button onClick={resetGame} disabled={timeLeft == 10}>Reset Game</button>
			</div>
			<p>Remaining time: {timeLeft}seconds</p>
			<p>Score: {score}</p>
		</div>
	);
}

export default Home;
