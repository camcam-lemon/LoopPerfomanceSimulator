import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import main from './main';

function App() {
    const [size, setSize] = useState(100);
    const [roop, setRoop] = useState(100);
    const [ranking, setRanking] = useState({});
    const [average, setAverage] = useState({});

    useEffect(() => {
        main(size, roop);
    }, []);

    const onClick = useCallback(
        () => {
            console.clear();
            const { ranking, average } = main(size, roop);
            setRanking(ranking);
            setAverage(average);
        },
        [size, roop],
    );

    return (
        <React.Fragment>
            <div style={{ margin: '1rem' }}>
                <span style={{ marginRight: '1rem' }}>配列のサイズ</span>
                <input type="number" value={size} onChange={e => setSize(Number(e.target.value))} />
            </div>
            <div style={{ margin: '1rem' }}>
                <span style={{ marginRight: '2rem' }}>ループ回数</span>
                <input type="number" value={roop} onChange={e => setRoop(Number(e.target.value))} />
            </div>
            <div>
                <Button onClick={onClick}>実行する</Button>
            </div>
        </React.Fragment>
    );
}

const Button = styled.button`
    background: white;
    color: palevioletred;

    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid palevioletred;
    border-radius: 3px;

    :hover {
        cursor: pointer;
        background: palevioletred;
        color: white;
    }
`;

ReactDOM.render(<App />, document.getElementById('content'));
