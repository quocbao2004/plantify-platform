import os

env = os.getenv("DJANGO_ENV", "local").lower()

if env == "production":
    from .production import *
elif env == "test":
    from .test import *
else:
    from .local import *
