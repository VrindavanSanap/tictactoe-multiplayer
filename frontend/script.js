let board = ["", "", "", "", "", "", "", "", ""];
let game_status = ""; // Empty means game is ongoing

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

function handle_cell_click(cell_id) {
    const index = parseInt(cell_id.split('-')[1]);
    const error_message = document.getElementById('error-message');

    if (board[index] === "") {
        board[index] = 'X';
        update_ui();
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