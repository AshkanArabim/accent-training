from flask import Flask, current_app
from turnWordToIpa import word2Ipa
from aud2ipa import aud2IPA
from word2aud import word2AUD
import os

app = Flask(__name__)
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
    
@app.route("/aud2ipa" , methods = ['POST'])
def aud2ipa():
    audio = request.files['file']

    # i = 1
    # while True:
    #     dst = os.path.join(
    #         current_app.instance_path,
    #         current_app.config.get('UPLOAD_FOLDER', 'uploads'),
    #         f'audio_record_{i}.wav')
    #     if not os.path.exists(dst): break
    #     i += 1

    # audio.save(dst)
    return aud2IPA(audio)

@app.route('/word2aud/<word>') #Move to JS
def word2aud(word):
    return word2AUD(word)

if __name__ == "__main__":
    app.run(port=5000)