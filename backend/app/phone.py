import re

_STRIP = re.compile(r"[\s\-().]")


def normalize_phone(raw: str) -> str:
    """Return a phone number as "+" followed by 8-15 digits (E.164 style).

    Accepts "+251 911-22 33 44", "00251911223344" and Telegram's "251911223344".
    Raises ValueError for anything that isn't an international number, because a
    local number like "0911..." can't be matched to a country (or a Telegram link).
    """
    s = _STRIP.sub("", raw or "")
    if s.startswith("00"):
        s = "+" + s[2:]
    elif not s.startswith("+"):
        s = "+" + s
    if not re.fullmatch(r"\+[1-9]\d{7,14}", s):
        raise ValueError("Enter your number in international format, for example +251911223344")
    return s
