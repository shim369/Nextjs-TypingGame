import { useState, useEffect, useRef } from 'react';
import styles from "@/styles/Home.module.css";

type WordData = {
  words: string[];
};

const Home: React.FC = () => {
    const [currentWord, setCurrentWord] = useState<string>("");
    const [typedWord, setTypedWord] = useState<string>("");
    const [score, setScore] = useState<number>(0);
    const [message, setMessage] = useState<string>("ゲームを開始してください");
    const [timeLeft, setTimeLeft] = useState<number>(10);
    const [isGameActive, setIsGameActive] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // ページが読み込まれるたびにスコアをリセット
    useEffect(() => {
        setScore(0);
    }, []);

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
        setMessage("リセットされました");
        fetchWord();
    };


    useEffect(() => {
        if (isGameActive && inputRef.current) {
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
            setMessage("タイムアップ！");
        }
    }, [timeLeft, isGameActive]);

    const fetchWord = async () => {
        try {
            const response = await fetch('/words.json');
            const data: WordData = await response.json();
            const randomWord = data.words[Math.floor(Math.random() * data.words.length)];
            setCurrentWord(randomWord);
        } catch (error) {
            setMessage("単語の取得に失敗しました。もう一度試してください。");
        }
    }

    useEffect(() => {
        fetchWord();
    }, []);

    useEffect(() => {
        if (currentWord === typedWord) {
            setScore(prevScore => prevScore + 1);
            setTypedWord("");
            fetchWord();
        } else if (currentWord.startsWith(typedWord)) {
            setCurrentWord(currentWord.substring(typedWord.length));
            setTypedWord("");
        } else {
            setTypedWord(typedWord.slice(0, -1));
        }
    }, [typedWord, currentWord]);

    return (
        <div>
            <h2>タイピングゲーム</h2>
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
                        ゲームを開始
                        </button>
                    </>
                )}
                <button onClick={resetGame} disabled={timeLeft == 10}>リセット</button>
            </div>
            <p>残り時間: {timeLeft}秒</p>
            <p>スコア: {score}</p>
        </div>
    );
}

export default Home;
