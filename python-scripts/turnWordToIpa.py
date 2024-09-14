# import unirest
# import os

# api_key = "<" + os.environ.get('WORDS_API_KEY') + ">"
                         
# def word2Ipa():
#   # Authorization for WordsAPI
#   response = unirest.get("https://wordsapiv1.p.mashape.com/words/soliloquy",
#     headers={
#       "X-Mashape-Key": api_key,
#       "Accept": "application/json"
#     }
#   )