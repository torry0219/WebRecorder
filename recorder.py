from flask import Flask, render_template, request, send_from_directory, send_file
from pydub import AudioSegment
#import os

app = Flask(__name__)

@app.route('/')
def recorder():
    return render_template("recorder.html")

@app.route('/convert', methods = ["POST"])
def convert_audio():
    audio_data = request.files["audio"]
    audio_data.save("temp_rec.webm")
    wav_audio = AudioSegment.from_file("temp_rec.webm", format = "webm")
    wav_audio.export("rec.wav", format = "wav")

    return send_from_directory(".", "rec.wav", as_attachment=True)

if __name__ == '__main__':
    app.run(debug = True)
