from flask import Flask, render_template, request, jsonify
import json
from logic.first_follow import compute_first_follow

app = Flask(__name__)

INPUT_FILE = "data/input.json"
OUTPUT_FILE = "data/output.json"

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/compute", methods=["POST"])
def compute():
    data = request.json

    with open(INPUT_FILE, "w") as f:
        json.dump(data, f, indent=2)

    result = compute_first_follow(data)

    with open(OUTPUT_FILE, "w") as f:
        json.dump(result, f, indent=2)

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)