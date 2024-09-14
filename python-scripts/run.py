from flask import Flask
from turnWordToIpa import word2Ipa

app = Flask(__name__)

@app.route("/")
def home():
    return "home"

@app.route('/word2ipa/<word>')
def word2ipa(word):
    return word2Ipa(word)

if __name__ == "__main__":
    app.run(port=5000)