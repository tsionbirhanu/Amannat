def call_voxide_stt(audio_url: str) -> str:
    # TODO: wire real Voxide speech-to-text API using VOXIDE_API_KEY
    raise NotImplementedError("stub — replace with real Voxide call")

def call_voxide_tts(text: str) -> str:
    # TODO: wire real Voxide text-to-speech API using VOXIDE_API_KEY
    return f"stub://audio/{abs(hash(text))}.mp3"
