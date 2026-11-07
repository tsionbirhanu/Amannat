"""Server-side speech placeholders.

Voxide (https://voxide.dev) is a *browser* SDK: the live voice agent runs in the
frontend (frontend/src/lib/voxide.js) with the publishable key
NEXT_PUBLIC_VOXIDE_PUBLIC_KEY, and calls this API through its registered
capabilities. Voxide has no server-side speech-to-text / text-to-speech API, so the
functions below stay placeholders for the non-agent endpoints (/voice/query,
/voice/contract/read, /voice/report). The frontend reads their answers aloud with
the browser's own speech synthesis.
"""


def call_voxide_stt(audio_url: str) -> str:
    # No server-side STT provider is configured; clients send text instead.
    raise NotImplementedError("Server-side speech-to-text is not configured; send `text` instead of `audio_url`")


def call_voxide_tts(text: str) -> str:
    # No server-side TTS provider is configured; the frontend speaks the text itself.
    return f"stub://audio/{abs(hash(text))}.mp3"
