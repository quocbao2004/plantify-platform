from apps.accounts.models import User


def update_profile(user: User, **kwargs) -> User:
    for field, value in kwargs.items():
        if hasattr(user, field):
            setattr(user, field, value)
    user.save()
    return user
