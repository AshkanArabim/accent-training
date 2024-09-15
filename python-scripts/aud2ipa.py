from allosaurus.app import read_recognizer

def aud2IPA(audio):
    # load your model
    model = read_recognizer()
    print("Got here")
    inference = model.recognize(audio)
    print(inference)
    # run inference -> æ l u s ɔ ɹ s
    return inference