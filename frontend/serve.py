#!/usr/bin/env python
import http.server
import socketserver
import os

# Change to the frontend directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

PORT = 3000

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving frontend at http://localhost:{PORT}")
    print("Backend API should be running at http://127.0.0.1:8000")
    httpd.serve_forever()
