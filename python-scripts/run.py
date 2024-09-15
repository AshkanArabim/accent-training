from flask import Flask, current_app
from flask_cors import CORS  # Import CORS
from turnWordToIpa import word2Ipa
from aud2ipa import aud2IPA
from word2aud import word2AUD
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

app.config['UPLOAD_FOLDER'] = 'uploads'
try:
    os.makedirs(os.path.join(
        app.instance_path,
        app.config.get('UPLOAD_FOLDER', 'uploads')
    ), exist_ok=True)
except:
    pass

@app.route("/")
def home():
    return "home"

@app.route('/word2ipa/<word>')
def word2ipa(word):
    return word2Ipa(word)
    
@app.route("/aud2ipa", methods=['POST'])
def aud2ipa():
    audio = request.files['file']
    return aud2IPA(audio)

@app.route('/word2aud/<word>') # Move to JS
def word2aud(word):
    return word2AUD(word)

if __name__ == "__main__":
    app.run(port=5000)
