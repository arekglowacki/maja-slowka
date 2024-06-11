import {Word} from "../words/words-provider.ts";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";
import Timeout from "./timeout.tsx";
import {basePath} from "../conf.ts";

const TIMEOUT_SECONDS = 6;

interface WordViewProps {
    word: Word;
    onWrongAnswer: (wordId: string) => void;
    onCorrectAnswer: (wordId: string) => void;
}

const Container = styled.div`
  max-width: 800px;
`;

const ImgWrapper = styled.div`
  width: 500px;
  margin: 2em;
  border-radius: 10px;
  overflow: hidden;
`;

const ButtonsContainer = styled.div`
  display: flex;
  column-gap: 3em;
  justify-content: center;
  margin-top: 4em;
`;

export const WordView = (props: WordViewProps) => {
    const word = props.word;
    const [secondsLasted, setSecondsLasted] = useState(0);

    const timeoutFunc = () => {
        setSecondsLasted(secondsLasted + 1);
        if (secondsLasted < TIMEOUT_SECONDS) {
            setTimeout(timeoutFunc, 1000);
        }
    }

    useEffect(() => {
        const audio = new Audio(`${basePath}/audio/${word.id}_pl.mp3`);
        audio.play();
        setSecondsLasted(0);
        setTimeout(timeoutFunc, 1000);
    }, [word]);

    const playEng = () => {
        const audio = new Audio(`${basePath}/audio/${word.id}_en.mp3`);
        audio.play()
    }

    const playPl = () => {
        const audio = new Audio(`${basePath}/audio/${word.id}_pl.mp3`);
        audio.play()
    }

    return (
        <Container>
            <h1>{word.polish}</h1>
            <ImgWrapper>
                <img style={{width: "500px"}} src={`${basePath}/img/${word.id}.webp`} alt={word.polish}/>
            </ImgWrapper>
            <Timeout key={word.id} onTimeout={playEng} />
            <ButtonsContainer>
                <Button size="lg" variant="light" onClick={playEng}>
                    <img style={{width: '44px'}} src={basePath + "/EN.svg"}/>
                </Button>
                <Button size="lg" variant="light" onClick={playPl}>
                    <img style={{width: '44px'}} src={basePath + "/PL.svg"}/>
                </Button>
                <Button onClick={() => props.onWrongAnswer(word.id)} variant="danger" size="lg">Wrong</Button>
                <Button onClick={() => props.onCorrectAnswer(word.id)} variant="success" size="lg">Correct</Button>
            </ButtonsContainer>
        </Container>
    )
}