from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)
CORS(app)  # if frontend is in another port

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

HISTORY_DIR = os.path.join(BASE_DIR, "history")
hist_file = os.path.join(HISTORY_DIR, "hist.json")

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    user_message = data.get("message")

    hist = load_history()

    if len(hist)>=10:
        back_message = hist[:9] # son 10 mesaj
    else:
        back_message = hist

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"""
             last 10 messages: {back_message}
             user question: {user_message}
             answer user's question based on last chats.
             """}
        ]
    )

    answer = response.choices[0].message.content

    save_history(user_message,answer,hist)

    return jsonify({
        "answer": answer
    })

def load_history():
    if not os.path.exists(hist_file) or os.stat(hist_file).st_size == 0:
        hist = []
    else:
        with open(hist_file, "r", encoding="utf-8") as f:
            hist = json.load(f)
    return hist

def save_history(user_message, answer, hist):
    hist.append({
        "user": user_message,
        "ai": answer
    })

    with open(hist_file, "w", encoding="utf-8") as f:
        json.dump(hist, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    app.run(debug=False, port=5000)
    print("bitti")