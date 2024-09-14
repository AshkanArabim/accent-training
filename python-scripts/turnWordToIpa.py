from requests.auth import HTTPBasicAuth
import requests
import os

def word2Ipa(word):
  api_key = "<" + os.environ.get('WORDS_API_KEY') + ">"
  auth = HTTPBasicAuth('apikey', '62661a091cmshd7f7e3dac296219p1918f4jsn2a253a5c6f6e')
  response = requests.get("https://wordsapiv1.p.rapidapi.com/words/" + word + "/pronunciation", auth=auth)
  return response.text