from flask import Flask
# from turnWordToIpa import word2Ipa
from aud2ipa import aud2IPA

app = Flask(__name__)

@app.route("/")
def home():
    return "home"

@app.route('/word2ipa/<word>')
def word2ipa(word):
    # return word2Ipa(word)
    return ""
    
@app.route("/aud2ipa")
def aud2ipa():
    return aud2IPA("file")

if __name__ == "__main__":
    app.run(port=5000)