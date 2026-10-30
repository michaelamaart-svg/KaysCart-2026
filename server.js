const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 5500;

const server = http.createServer((req, res) => {
    let filePath = req.url === "/" ? "/index.html" : req.url;
    filePath = path.join(__dirname, filePath);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end("File not found");
            return;
        }

        const ext = path.extname(filePath);

        const types = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".webp": "image/webp"
};

        res.writeHead(200, {
            "Content-Type": types[ext] || "text/plain"
        });

        res.end(content);
    });
});

server.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}`);
});