import { Accordion, AccordionBody, AccordionHeader, AccordionList, Flex, Title } from '@tremor/react';
import React, {useContext, useMemo, useState } from 'react';
import API from '../request';
import { AppInfoContext } from '../AppInfoModel';
import {useNavigate}  from 'react-router-dom';
import Header from '../header/Header';

const History = () => {
    const api = new API();
    const [total , setTotal] = useState(0);
    const info = useContext(AppInfoContext);
    const navigator = useNavigate();
    if (!info.isLoggedIn) {
       navigator('/login');
    }
    const [list,setList] = useState([]);
        useMemo(async() => {
        const games = await api.getMyGames();
        const subList = [];
        const n = games.length;
        const chunkSize = 3;
        for (let i = 0; i < n; i += chunkSize) {
            const subListChunk = games.slice(i, i + chunkSize);
            subList.push(subListChunk);
        }
        setList(subList);
        let sum = 0;
        games.forEach(game => {
            sum += parseInt(game.score);
        });
        setTotal(sum/3);
    }, []);

    return (
        
        <>
        <Header/>
        <Title  className='mt-4 text-center' style={{ fontSize: '42px' }}> History</Title>
        <Title  className='mt-4 text-center' style={{ fontSize: '32px' }}> Total Score: {total}</Title>
        <div style={{ width: '75vw', margin: '0 auto',  marginTop:'5vw' }}>
             
            <AccordionList>
                {list.map((subList, index) => {
                    return (
                        <Accordion key={index}>
                            <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                <Flex>
                                    <div>Game {index +1}</div>
                                    <div>Score {subList[0].score}</div>
                                </Flex>
                            </AccordionHeader>
                            <AccordionBody className="leading-6">
                                <Flex>
                                    {subList.map((game, i) => {
                                        return (
                                            <div key={game.url + i * 17} className="flex flex-col gap-y-4">
                                                <div className="flex flex-row gap-x-4">
                                                    <div className="font-semibold">Round {i + 1}</div>
                                                    <div> {game.correct === '1' ? "Correct" : game.correct === '0' ? "Wrong": "Skipped"}</div>
                                                </div>
                                                <div className="flex flex-row gap-x-4">
                                                    <img src={"/"+ game.url} className="w-45 h-32" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </Flex>
                            </AccordionBody>
                        </Accordion>
                    );
                })}
            </AccordionList>
        </div>
        </> );
};

export default History;