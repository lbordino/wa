import { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { Flex, Card, Button, Bold, Title, Text } from '@tremor/react';
import ProgressBar from "@ramonak/react-progress-bar";
import { GameLogic } from '../logic/logic';
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import Header from '../header/Header';
import { useNavigate } from 'react-router-dom';
import { AppInfoContext } from '../AppInfoModel';


function Console() {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const timer = useRef(null);
    const info = useContext(AppInfoContext);
    const [isCorrect, setIsCorrect] = useState(false);
    const result = useContext(GameLogic);
    if (info.isLoggedIn) {
        result.maxRounds = 3;
    } else {
        result.maxRounds = 1;
    }
    const [progressColor, setProgressColor] = useState("#3b82f6")
    const [round, setRound] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const navigator = useNavigate();

    function handleAnswer(caption) {
        clearInterval(timer.current);
        result.setAnswer(caption).then((val) => {
            setIsCorrect(val);
            setRound(result.currentRound);
            setIsOpen(true);
        });

       

    }
    function nextGame() {
        if (info.isLoggedIn) {
            setIsLoading(true);
            result.saveGame().then(() => {
                result.reset();
                setIsLoading(false);
                nextRound();
            });
        } else {
            result.reset();
            setIsLoading(false);
            nextRound();
        }
    }
    function nextRound() {
        result.handleSkipped();
        result.getRound().then((r) => {
            setProgress(-5);
            setProgressColor("#3b82f6");
            setRound(r);
        }).catch((e) => {
            console.log(e);
        });
        setIsOpen(false);
        setIsCorrect(false);
    }
    useMemo(async () => {
        const r = await result.getRound();
        if (r) {
            setRound(r);
        }
    }, []);
    useEffect(() => {
        timer.current = setInterval(() => {
            setProgress((prevProgress) => {
                const newProgress = prevProgress + 5;
                if (newProgress >= 100) {
                    clearInterval(timer.current);
                    result.skipRound();
                    setProgressColor("red")
                    setIsOpen(true);
                    //TODO POP UP RESULT
                }
                return newProgress;
            });
        }, 1500);

        return () => {
            clearInterval(timer.current);
        };
    }, [progress]);
    if (round === undefined) {
        const r = result.getResults();
        return (
            <>
                <Header />
                {isLoading ? <div className='h-screen flex flex-col items-center justify-center'>
                    <Title className='m-4 text-center' style={{ fontSize: '32px' }}> Loading...</Title>
                </div> :
                    <div className='h-screen flex flex-col items-center justify-center'>
                        <Title className='m-4 text-center' style={{ fontSize: '32px' }}> Guess the <Bold>Caption!</Bold></Title>
                        <Flex justifyContent='center'>
                            <Title className='m-4 text-center' style={{ fontSize: '24px' }}>Your Score is {r}</Title>
                        </Flex>
                        <Flex justifyContent='center'>
                            {info.isLoggedIn ? <Button onClick={() => {
                                result.saveGame().then(() => {
                                    result.reset();
                                    navigator("/");
                                });
                            }} className='m-4'>Save & Exit</Button> : <></>}
                            <Button onClick={nextGame} className='m-4'>Play Again</Button>

                            <Button onClick={() => {
                                result.reset();
                                navigator("/");

                            }} className='m-4'>Exit</Button>
                        </Flex>
                    <Flex justifyContent='evenly'>

                    {result.game.map((round, index) => {
                                if (round.correct === true) {
                                    return (
                                        <div className='m-6'>
                                            <img src={round.meme} style={{ display: 'block', margin: '0 auto', borderRadius: '15px', width: '400px' }} />
                                            <Text>Round {index + 1}: Correct</Text>
                                            <Text> {round.answer} </Text>

                                        </div>
                                    );
                                }
                            })}
                    </Flex>
                    </div>}
            </>);
    }
    return (
        <>
            <Header />
            <Dialog id={"card-dialog"} open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <Card className="max-w-lg space-y-4 p-12">
                        <DialogTitle className="font-bold">Result</DialogTitle>
                        {  isCorrect ? <Description >Your answer is correct !! </Description> : <Description> Unfortunately your answer was wrong</Description>}
                        <Text>Whenever you are ready click the next button</Text>
                        <Text>The correct answer were:</Text>
                        <Text> {round.answer1}  <Bold>OR</Bold> {round.answer2}</Text>
                        <div className="flex gap-4">
                            <Button onClick={nextRound}>NEXT</Button>
                        </div>
                    </Card>
                </div>
            </Dialog>
            <div className='h-screen flex flex-col items-center justify-center'>
                <>
                    <div className='w-75'>
                        <Card id='card-console' style={{ borderRadius: '8px' }}>
                            <Title className='m-4 text-center' style={{ fontSize: '32px' }}> Guess the <Bold>Caption!</Bold></Title>
                            <Title className='m-4 text-center' style={{ fontSize: '24px' }}> {round.name}</Title>
                            {round.answer1 && <Text className='m-4 text-center' style={{ fontSize: '16px' }}> {round.answer1}  <Bold>OR</Bold> {round.answer2}</Text>}
                            <img className="m-4 wm-50" src={"/"+round.meme} style={{ display: 'block', margin: '0 auto', borderRadius: '15px', width: '400px' }} />
                            <Flex justifyContent='between' className='mt-4'>
                                {round.captions && round.captions.slice(0, 3).map((caption, index) => {
                                    return <Button key={index} onClick={() => {
                                        handleAnswer(caption);
                                        //POP UP RESULT
                                    }} className='m-1'>{caption}</Button>
                                })}
                            </Flex>
                            <Flex justifyContent='between' className='mt-4'>
                                {round.captions && round.captions.slice(3, 5).map((caption, index) => {
                                    return <Button key={index} onClick={() => {
                                        handleAnswer(caption);
                                        //POP UP RESULT
                                    }} className='m-1'>{caption}</Button>
                                })}
                            </Flex>
                            <Flex justifyContent='between' className='mt-4'>
                                {round.captions && round.captions.slice(5, 7).map((caption, index) => {
                                    return <Button key={index} onClick={() => {
                                        handleAnswer(caption);
                                        //POP UP RESULT
                                    }} className='m-2'>{caption}</Button>
                                })}
                            </Flex>
                        </Card>
                        <ProgressBar className='mt-8' completed={progress} bgColor={progressColor} height={"0.7rem"} isLabelVisible={false} />
                    </div>
                </>
            </div>
        </>
    );
}


export default Console;
