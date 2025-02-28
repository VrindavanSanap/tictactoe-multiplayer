from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize game state
board = ["" for _ in range(9)]
game_status = ""
current_turn = "X"  # X goes first

@app.route("/game_state")
def get_game_state():
    return jsonify({
        "board": board,
        "status": game_status,
        "turn": current_turn
    })
