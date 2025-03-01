import React, { useEffect, useState } from "react";
import "./Game.css"; // Assuming your CSS file is in the same directory

function TicTacToe() {
	const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
	const [gameStatus, setGameStatus] = useState(""); // Empty means game is ongoing
	const [currentTurn, setCurrentTurn] = useState("X"); // Track whose turn it is
	const [errorMessage, setErrorMessage] = useState("");
	const [showError, setShowError] = useState(false);

	// Function to fetch game state from server
	async function fetchGameState() {
		try {
			const response = await fetch('https://tictaktoe.duckdns.org:5000/game_state');
			const data = await response.json();
			setBoard(data.board);
			setGameStatus(data.status);
			setCurrentTurn(data.turn);
		} catch (error) {
			console.error('Error fetching game state:', error);
			setErrorMessage("Error connecting to server");
			setShowError(true);
			setTimeout(() => {
				setShowError(false);
			}, 4000);
		}
	}

	useEffect(() => {
		fetchGameState();
		const interval = setInterval(fetchGameState, 1000);
		return () => clearInterval(interval); // Cleanup on unmount
	}, []);

	async function uploadMove(position) {
		await fetch("https://tictaktoe.duckdns.org:5000/move", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ position: position })
		});
	}

	async function handleCellClick(index) {
		if (board[index] === "") {
			try {
				// We don't update the state directly here
				// Instead, we send the move to the server and let the next fetchGameState update our UI
				await uploadMove(index);
				setErrorMessage("");
				setShowError(false);
			} catch (error) {
				console.error('Error uploading move:', error);
				setErrorMessage("Error connecting to server");
				setShowError(true);
				setTimeout(() => {
					setShowError(false);
				}, 4000);
			}
		} else {
			setErrorMessage("Invalid move! Cell is already taken.");
			setShowError(true);
			setTimeout(() => {
				setShowError(false);
			}, 4000);
		}
	}

	return (
		<div className="game-container">
			<div className="board">
				{board.map((cell, index) => (
					<div
						key={index}
						className="cell"
						id={`cell-${index}`}
						onClick={() => handleCellClick(index)}
					>
						{cell}
					</div>
				))}
			</div>

			<div id="status">
				{gameStatus ? gameStatus : `Player ${currentTurn}'s Turn`}
			</div>
			<div
				id="error-message"
				style={{ visibility: showError ? 'visible' : 'hidden' }}
			>
				{errorMessage}
			</div>
		</div>
	);
}

export default TicTacToe;