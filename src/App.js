import React, { useEffect, useRef, useState, useReducer } from 'react';
import './App.css'

const COLUMNS = 7;
const ROWS = 6;
export default function App() {
  const [{ boards, winner, isGameOver }, dispatch] = useReducer(reducer, genEmptyState())

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {winner && <h1>Player {winner} Wins</h1>}
      <div className='board'>
        {boards.map((col, colIndex) => <div key={'col-' + colIndex} className='column' onClick={() => {
          dispatch({type:'move',colIndex}) }}>
          {col.map((tile, rowIndex) => <div key={'row-' + rowIndex + 'col-' + rowIndex} className='tile'>
            {tile && <div className={`player player-${tile}`}></div>}
          </div>)}
        </div>)}
      </div>
      {(winner || isGameOver) && <button onClick={()=>{dispatch({type:'restart'})}}>Restart</button>}
    </div>)
}

const reducer = (state, action) => {
  switch(action.type){
    case 'restart':return genEmptyState();
    case 'move':{
      const {boards,currentPlayer}=state;
      if(state.isGameOver || boards[action.colIndex][0])return state;
      let newboards=[...boards];
      let col=[...newboards[action.colIndex]];
      let rowIndex=col.lastIndexOf(null);
      col[rowIndex]=currentPlayer;
      newboards[action.colIndex]=col;
      let checkwinHorizontal=isWin(rowIndex,action.colIndex,0,1,newboards,currentPlayer);
      let checkwinVertical=isWin(rowIndex,action.colIndex,1,0,newboards,currentPlayer);
      let checkwinDiagTopLeftBottomRight=isWin(rowIndex,action.colIndex,1,1,newboards,currentPlayer);
      let checkwinDiagTopRightBottomLeft=isWin(rowIndex,action.colIndex,-1,1,newboards,currentPlayer);
      const winner=checkwinHorizontal || checkwinVertical || checkwinDiagTopLeftBottomRight || checkwinDiagTopRightBottomLeft
      const fullBoard=newboards.every(column=>column[0]!=null);
      return {boards:newboards,currentPlayer:currentPlayer==1?2:1,isGameOver:winner||fullBoard,winner}
    };
    default:return state;
  }
}

const genEmptyState = () => {
  return {
    boards: new Array(COLUMNS).fill(null).map(_ => new Array(ROWS).fill(null)),
    winner: null,
    currentPlayer: 1,
    isGameOver: false
  }
}

function isWin(rowStart,colStart,rowIncrement,colIncrement,boards,currentPlayer){
  let currentRow=rowStart;
  let currentCol=colStart;
  let numTile=0;
  while (currentRow<ROWS && currentCol<COLUMNS && boards[currentCol][currentRow]==currentPlayer){
    currentRow+=rowIncrement;
    currentCol+=colIncrement;
    numTile++;
  }

  currentRow=rowStart-rowIncrement;
  currentCol=colStart-colIncrement;

  while (currentRow>=0 && currentCol>=0 && boards[currentCol][currentRow]==currentPlayer){
    currentRow-=rowIncrement;
    currentCol-=colIncrement;
    numTile++;
  }
  return (numTile>=4?currentPlayer:null)
}