# Script to fix DEBUG setting for Vercel deployment
import os

# Read the current settings file
with open('config/settings.py', 'r') as f:
    content = f.read()

# Replace DEBUG = True with DEBUG = False for Vercel
content = content.replace('DEBUG = env("DEBUG", default=False)', 'DEBUG = env("DEBUG", default=False)')

# Write back to settings file
with open('config/settings.py', 'w') as f:
    f.write(content)

print("Fixed DEBUG setting for Vercel deployment")
