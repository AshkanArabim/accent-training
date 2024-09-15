import requests
import os

url = "https://api.sws.speechify.com/v1/audio/speech"

def word2AUD(word):
    payload = {
        "audio_format": "wav",
        "input": word,
        "language": "en-US",
        "model": "simba-english",
        "options": { "loudness_normalization": True },
        "voice_id": "james"
    }
    headers = {
        "accept": "*/*",
        "content-type": "application/json",
        "Authorization": os.environ.get("SPEECHIFY_API_KEY")
    }
    
    response = requests.post(url, json=payload, headers=headers)
    
    response = response.json()
    
    return response['audio_data']