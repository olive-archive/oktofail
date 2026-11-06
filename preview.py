"""
OPTIONAL: preview the site on your own computer before publishing.

How to use it (only if you have Python installed):
  1. Open a terminal / command prompt in this folder.
  2. Run:   python3 preview.py        (on Windows you may need:  python preview.py)
  3. Open   http://localhost:8000   in your browser.
  4. Press Ctrl+C in the terminal to stop.

You do NOT need this to publish. Pushing to GitHub is enough.
"""
import http.server
import os
import socketserver

PORT = 8000


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        clean = self.path.split("?")[0].split("#")[0]
        file_path = self.translate_path(clean)
        # Addresses like /about have no file: show the main page, which loads about.json
        if not os.path.exists(file_path) and "." not in os.path.basename(clean):
            self.path = "/index.html"
        return super().do_GET()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


os.chdir(os.path.dirname(os.path.abspath(__file__)))
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Preview running at http://localhost:%d  (Ctrl+C to stop)" % PORT)
    httpd.serve_forever()
