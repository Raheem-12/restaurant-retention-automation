from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.request


N8N_WEBHOOK_URL = "http://localhost:5678/webhook/restaurant-signup"


class RequestHandler(BaseHTTPRequestHandler):

    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")


    def do_OPTIONS(self):
        self.send_response(204)
        self.send_cors_headers()
        self.end_headers()


    def do_POST(self):

        if self.path != "/restaurant-signup":
            self.send_response(404)
            self.end_headers()
            return

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        request = urllib.request.Request(
            N8N_WEBHOOK_URL,
            data=body,
            headers={
                "Content-Type": "application/json"
            },
            method="POST"
        )

        try:
            with urllib.request.urlopen(request) as response:
                response_body = response.read()

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_cors_headers()
            self.end_headers()

            self.wfile.write(response_body)

        except Exception as error:
            print("Proxy error:", error)

            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.send_cors_headers()
            self.end_headers()

            self.wfile.write(b'{"success": false}')


server = HTTPServer(("0.0.0.0", 8080), RequestHandler)

print("Restaurant signup proxy running on http://localhost:8080")

server.serve_forever()