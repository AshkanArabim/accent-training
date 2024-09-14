from flask import Flask
<<<<<<< HEAD
import aud2ipa
=======
from turnWordToIpa import word2Ipa
>>>>>>> 0379d38d21e716c3845149f1fd3ab1507b298f95

app = Flask(__name__)

@app.route("/")
def home():
    return "home"

<<<<<<< HEAD
@app.route("/aud2ipa")
def aud2ipa():
    return "ipa set"
=======
@app.route('/word2ipa/<word>')
def word2ipa(word):
    return word2Ipa(word)
>>>>>>> 0379d38d21e716c3845149f1fd3ab1507b298f95

if __name__ == "__main__":
    app.run(port=5000)