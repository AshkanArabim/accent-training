import os
import requests
import json

def word2Ipa(word):
  api_key = os.environ.get('WORDS_API_KEY')
  url = "https://wordsapiv1.p.rapidapi.com/words/" + word + "/pronunciation"

  headers = {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "wordsapiv1.p.rapidapi.com"
  }

  response = requests.get(url, headers=headers)

  response = response.json()

  return response['pronunciation']['all']