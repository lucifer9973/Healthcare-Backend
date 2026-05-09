from .settings import *

# Override database for development
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# Add testserver for testing
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'testserver']
