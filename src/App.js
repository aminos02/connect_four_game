import React, { useEffect, useRef, useState } from 'react';
import './App.css'

const COLUMNS = 7;
const ROWS = 6;
export default function App() {
  const [currentPlayer, setCurrentPlayer] = useState('player-1');
  const [boards, setBoards] = useState(Array(COLUMNS).fill(null).map((v) => Array(ROWS).fill(null)));
  const [attempts, setAttempts] = useState(0)
  const [winner, setWinner] = useState(null)
  const [gamesOver, setGamesOver] = useState(false)

  const restartGame=()=>{
    setBoards(Array(COLUMNS).fill(null).map((v) => Array(ROWS).fill(null)));
    setCurrentPlayer('player-1');
    setAttempts(0);
    setWinner(null);
    setGamesOver(false)
  }
  
  const checkFourInArray = (arr) => {
    let res = false;
    if (arr.filter(x => x == 'player-1').length >= 4 || arr.filter(x => x >= 'player-2').length >= 4) {
      let k = 0;
      let _winner = null;
      arr.forEach((tile) => {
        if (tile == null && !res) { k = 0; return }
        if (tile == 'player-1') {
          if (k >= 0) k++;
          else k = 1
        } else if (tile == 'player-2') {
          if (k <= 0) k--;
          else k = -1;
        }
        if (k >= 4) res = 'player-1'
        else if (k <= -4) res = 'player-2'
      }
      )
      if (k >= 4) res = 'player-1'
      else if (k <= -4) res = 'player-2'
    }
    return res;
  }
  const checkWin = () => {
    let res = false, i = 0;
    // if(attempts<4)return false;
    //check per columns
    while (i < COLUMNS) {
      res = checkFourInArray([...boards[i]].reverse())
      if (res) break;
      i++;
    }


    //check by row
    if (!res) {
      for (let i = 0; i < ROWS; i++) {
        let row = []
        for (let j = 0; j < COLUMNS; j++) {
          row.push(boards[j][i]);
        }
        res = checkFourInArray(row);
        if (res) break;
      }
    }

    // check per  diagonal 
    if (!res) {
      let boardsCloneRight = Array(COLUMNS).fill(null).map((v) => Array(ROWS).fill(null))
      let boardsCloneLeft = Array(COLUMNS).fill(null).map((v) => Array(ROWS).fill(null))
      for (let i = 0; i < ROWS; i++) {
        let row = []
        for (let j = 0; j < COLUMNS; j++) {
          row.push(boards[j][i]);
        }

        for (let k = (5 - i); k < COLUMNS; k++) {
          boardsCloneRight[(k - 5) + i][i] = row[k]
        }
        for (let k = (i + 1); k < COLUMNS; k++) {
          boardsCloneLeft[7 - k + i][i] = row[k]
        }
      }

      i = 0;
      while (i < COLUMNS) {
        res = checkFourInArray(boardsCloneRight[i]) || checkFourInArray(boardsCloneLeft[i])
        if (res) break;
        i++;
      }

    }
    if(res){
    setWinner(res)
    setGamesOver(true)
    }
  }
  const addCircle = (index) => {
    if(winner ||gamesOver )return
    if (!boards[index].includes(null)) return;
    let isAdded = false;
    let i = 0;
    let boardsClone = [...boards.map(i => [...i])]
    setAttempts(attempts + 1)
    while ((!isAdded && i < ROWS)) {
      if (!boardsClone[index][ROWS - i - 1]) {
        boardsClone[index][ROWS - i - 1] = currentPlayer;
        isAdded = true;
      }
      i++
    }
    setBoards(boardsClone);
    setCurrentPlayer(currentPlayer == 'player-1' ? 'player-2' : 'player-1')
  }
  useEffect(() => {
    if (attempts == 0) return
    if(attempts ==(COLUMNS*ROWS)) setGamesOver(true)
    checkWin()
  }, [attempts])
  return (
    <div style={{ display: 'flex',flexDirection:'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {winner && <h1>Player {winner == "player-1" ? 1 : 2} Wins</h1>}
     <div className='board'>
        {boards.map((col, colIndex) => <div key={'col-' + colIndex} className='column' onClick={() => {
          addCircle(colIndex)
        }}>
          {col.map((tile, rowIndex) => <div key={'row-' + rowIndex + 'col-' + rowIndex} className='tile'>
            {tile && <div className={`player${tile ? ' ' + tile : ''}`}></div>}
          </div>)}
        </div>)}
      </div>
      {(winner || gamesOver) && <button onClick={restartGame}>Restart</button>}
    </div>)
}