def send_otp_sms(phone: str, code: str) -> None:
    # TODO: wire real SMS gateway
    print(f"[SMS STUB] OTP for {phone}: {code}")

def send_alert_sms(phone: str, message: str) -> None:
    # TODO: wire real SMS gateway
    print(f"[ALERT SMS STUB] to {phone}: {message}")
