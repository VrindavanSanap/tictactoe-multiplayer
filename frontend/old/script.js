let board = ["", "", "", "", "", "", "", "", ""];
let game_status = ""; // Empty means game is ongoing
let current_turn = "X"; // Track whose turn it is
// Function to fetch game state from server
async function fetch_game_state() {
    try {
        const response = await fetch('https://tictaktoe.duckdns.org:5000/game_state');
        const data = await response.json();
        board = data.board;
        game_status = data.status;
        current_turn = data.turn;
        update_ui();
    } catch (error) {
        console.error('Error fetching game state:', error);
        const error_message = document.getElementById('error-message');
        error_message.innerText = "Error connecting to server";
        error_message.style.visibility = 'visible';
        setTimeout(() => {
            error_message.style.visibility = 'hidden';
        }, 4000);
    }
}

// Fetch initial game state
fetch_game_state();

// Poll for updates every 2 seconds
setInterval(fetch_game_state, 1000);

function update_ui() {
    for (let i = 0; i < 9; i++) {
        const cell = document.getElementById(`cell-${i}`);
        cell.innerText = board[i];
    }
    
    const status_element = document.getElementById('status');
    if (game_status) {
        status_element.innerText = game_status;
    } else {
        status_element.innerText = "Player X's Turn";
    }
}
async function upload_move(position) { 
    await fetch("https://tictaktoe.duckdns.org:5000/move", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ position: position})
	})

}
async function handle_cell_click(cell_id) {
    const index = parseInt(cell_id.split('-')[1]);
    const error_message = document.getElementById('error-message');

    if (board[index] === "") {
        board[index] = current_turn;
        current_turn = current_turn === "X" ? "O" : "X";

        update_ui();
        await upload_move(index);

        error_message.style.visibility = 'hidden';
    } else {
        error_message.innerText = "Invalid move! Cell is already taken.";
        error_message.style.visibility = 'visible';
        setTimeout(() => {
            error_message.style.visibility = 'hidden';
        }, 4000);
    }
}

Array.from(document.getElementsByClassName("cell")).forEach(cell => {
    cell.addEventListener('click', () => {
        handle_cell_click(cell.id);
    });
});