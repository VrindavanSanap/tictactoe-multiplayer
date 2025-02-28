from flask import Flask, jsonify, request
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
@app.route("/move", methods=["POST"])
def make_move():
    global board, game_status, current_turn
    
    position = request.json.get("position" )
    
    # Validate move
    if not (0 <= position <= 8) or board[position] != "":
        return jsonify({"error": "Invalid move"}), 400
        
    # Make the move
    board[position] = current_turn
    
    # Switch turns
    current_turn = "O" if current_turn == "X" else "X"
    
    return jsonify({
        "board": board,
        "status": game_status,
        "turn": current_turn
    })
if __name__ == "__main__":
    # SSL certificate and key paths
    ssl_cert = "cert.pem"
    ssl_key = "key.pem"
    
    # Run with gunicorn using SSL
    import gunicorn.app.base
    
    class StandaloneApplication(gunicorn.app.base.BaseApplication):
        def __init__(self, app, options=None):
            self.options = options or {}
            self.application = app
            super().__init__()

        def load_config(self):
            for key, value in self.options.items():
                self.cfg.set(key.lower(), value)

        def load(self):
            return self.application

    options = {
        'bind': '0.0.0.0:5000',
        'workers': 2,
        'certfile': ssl_cert,
        'keyfile': ssl_key
    }

    StandaloneApplication(app, options).run()
