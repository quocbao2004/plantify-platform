def normalize_email_address(email: str) -> str:
    """Normalize email address to lowercase and trimmed."""
    if not email:
        return ""
    email = email.strip()
    try:
        email_name, domain_part = email.rsplit("@", 1)
    except ValueError:
        return email.lower()
    return f"{email_name}@{domain_part.lower()}"
