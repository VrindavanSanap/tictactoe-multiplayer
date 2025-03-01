// import React from "react";
import "./Game.css"; // Assuming your CSS file is in the same directory

function TicTacToe() {
  return (
    <div className="game-container">
      <div className="board">
        <div className="cell" id="cell-0"></div>
        <div className="cell" id="cell-1"></div>
        <div className="cell" id="cell-2"></div>
        <div className="cell" id="cell-3"></div>
        <div className="cell" id="cell-4"></div>
        <div className="cell" id="cell-5"></div>
        <div className="cell" id="cell-6"></div>
        <div className="cell" id="cell-7"></div>
        <div className="cell" id="cell-8"></div>
      </div>

      <div id="status">Player X's Turn</div>
      <div id="error-message">asdfadf</div>
    </div>
  );
}

export default TicTacToe;