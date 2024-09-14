from flask import Flask
import aud2ipa

app = Flask(__name__)

@app.route("/")
def home():
    return "home"

@app.route("/aud2ipa")
def aud2ipa():
    return "ipa set"

if __name__ == "__main__":
    app.run(port=5000)