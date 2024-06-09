import React, {useState} from 'react'
import './App.css'
import {initialWords} from "./words/initial-words.ts";
import {addPointToWord, getNextWord, removePointFromWord, Word} from "./words/words-provider.ts";
import {WordView} from "./word-view/WordView.tsx";
import ProgressBar from "react-bootstrap/ProgressBar";
import ConfettiExplosion from 'react-confetti-explosion';

function loadWords() {
    return initialWords;
}

function getWordById(words: Word[], id: string) {
    return words.find(word => word.id === id);
}

const saveDataToLocalStorage = (key: string, data: any) => {
    if (Array.isArray(data)) {
        localStorage.setItem(key, JSON.stringify(data));
    } else {
        console.error('Data must be an array');
    }
};

const readDataFromLocalStorage = (key: string): Word[] | null => {
    const data = localStorage.getItem(key);
    if (data) {
        return JSON.parse(data);
    } else {
        return null;
    }
};

const CORRECT_ANSWERS_GOAL = 25;

function App() {
    const words = readDataFromLocalStorage('words_data') || loadWords();
    const [currentWord, setCurrentWord] = useState(getNextWord(words));
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [isExploding, setIsExploding] = React.useState(false);

    const nextWord = () => {
        saveDataToLocalStorage('words_data', words);
        let next = getNextWord(words);
        for (let i = 0; i < 5; i++) {
            if (next.id !== currentWord.id) {
                break;
            }
            next = getNextWord(words);
        }
        setCurrentWord({...next});
    }

    const onCorrectAnswer = () => {
        addPointToWord(getWordById(words, currentWord.id) as Word);
        setCorrectAnswers((prev) => {
            console.log(prev);
            let newVal = prev + 1;
            if (newVal === CORRECT_ANSWERS_GOAL) {
                setIsExploding(true);
            }
            if (newVal > CORRECT_ANSWERS_GOAL) {
                newVal = 1;
                setIsExploding(false);
            }
            console.log(newVal);
            return newVal;
        });
        nextWord();
    }

    return (
        <>
            <div>
                {isExploding && <ConfettiExplosion />}
                <ProgressBar variant="success"
                             style={{height: "32px"}}
                             label={`${correctAnswers} / ${CORRECT_ANSWERS_GOAL}`}
                             now={(correctAnswers / CORRECT_ANSWERS_GOAL) * 100}
                />
                <WordView word={currentWord}
                          onWrongAnswer={() => {
                              removePointFromWord(getWordById(words, currentWord.id) as Word);
                              nextWord();
                          }}
                          onCorrectAnswer={onCorrectAnswer}
                />
            </div>
        </>
    )
}

export default App
