from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)
CORS(app)  # frontend başka porttaysa gerekli

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

HISTORY_DIR = os.path.join(BASE_DIR, "history")
hist_file = os.path.join(HISTORY_DIR, "hist.json")

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    user_message = data.get("message")

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": user_message}
        ]
    )

    answer = response.choices[0].message.content

    print("yazacak")
    # history yönetimi
    save_log(user_message,answer)
    # history yönetimi bitti
    print("yazdı")
    return jsonify({
        "answer": answer
    })

def save_log(user_message, answer):
    if not os.path.exists(hist_file) or os.stat(hist_file).st_size == 0:
        hist = []
    else:
        with open(hist_file, "r", encoding="utf-8") as f:
            hist = json.load(f)

    hist.append({
        "user": user_message,
        "ai": answer
    })

    with open(hist_file, "w", encoding="utf-8") as f:
        json.dump(hist, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    app.run(debug=False, port=5000)
    print("bitti")