from allosaurus.app import read_recognizer

def aud2IPA(audio):
    # load your model
    model = read_recognizer()

    # run inference -> æ l u s ɔ ɹ s
    return model.recognize(audio)