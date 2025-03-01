from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize game state
board = ["" for _ in range(9)]
game_status = "ongoing"  # Added initial status
current_turn = "X"  # X goes first

def check_winner():
    """Check if there's a winner or a draw."""
    winning_combinations = [
        (0, 1, 2), (3, 4, 5), (6, 7, 8),  # Rows
        (0, 3, 6), (1, 4, 7), (2, 5, 8),  # Columns
        (0, 4, 8), (2, 4, 6)             # Diagonals
    ]
    for a, b, c in winning_combinations:
        if board[a] == board[b] == board[c] != "":
            return board[a]  # Return 'X' or 'O' as winner
    if "" not in board:
        return "draw"
    return None

@app.route("/game_state", methods=["GET"])
def get_game_state():
    return jsonify({
        "board": board,
        "status": game_status,
        "turn": current_turn
    })

@app.route("/move", methods=["POST"])
def make_move():
    global board, game_status, current_turn
    
    # Get position from request
    data = request.get_json()
    if not data or "position" not in data:
        return jsonify({"error": "Missing position in request"}), 400
    
    try:
        position = int(data["position"])
    except (ValueError, TypeError):
        return jsonify({"error": "Position must be an integer"}), 400
    
    # Validate move
    if not (0 <= position <= 8):
        return jsonify({"error": "Position must be between 0 and 8"}), 400
    if board[position] != "":
        return jsonify({"error": "Position already taken"}), 400
    if game_status != "ongoing":
        return jsonify({"error": "Game is already over"}), 400
    
    # Make the move
    board[position] = current_turn
    
    # Check for winner or draw
    result = check_winner()
    if result == "draw":
        game_status = "draw"
    elif result:
        game_status = f"{result} wins"
    else:
        # Switch turns if game continues
        current_turn = "O" if current_turn == "X" else "X"
    
    return jsonify({
        "board": board,
        "status": game_status,
        "turn": current_turn
    })



if __name__ == "__main__":
    # Using Let's Encrypt SSL certificates
    app.run(host='0.0.0.0', port=5000, ssl_context=('/etc/letsencrypt/live/tictaktoe.duckdns.org/fullchain.pem', 
                                                   '/etc/letsencrypt/live/tictaktoe.duckdns.org/privkey.pem'))