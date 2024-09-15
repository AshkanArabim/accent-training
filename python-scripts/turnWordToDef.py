import os
import requests
import json

def word2Def(word):
  api_key = os.environ.get('WORDS_API_KEY')
  url = "https://wordsapiv1.p.rapidapi.com/words/" + word + "/definitions"

  headers = {
    "x-rapidapi-key": "62661a091cmshd7f7e3dac296219p1918f4jsn2a253a5c6f6e",
    "x-rapidapi-host": "wordsapiv1.p.rapidapi.com"
  }

  response = requests.get(url, headers=headers)

  response = response.json()

  return response['definitions'][0]['definition']