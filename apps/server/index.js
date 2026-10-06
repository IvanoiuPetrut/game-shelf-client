const express = require("express");
const cors = require("cors");
const path = require("path");

// Load apps/server/.env when present (local development)
try {
  process.loadEnvFile(path.join(__dirname, ".env"));
} catch {
  // No .env file, rely on the environment
}

const PORT = process.env.PORT || 8080;
const STATIC_DIR =
  process.env.STATIC_DIR || path.join(__dirname, "../client/dist");

const app = express();

// * Middlewares

// The built client is served from this same origin in production, so CORS is
// only needed when running the client from another origin during development.
if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}

// * API Routes

const api = express.Router();
api.use("/games", require("./routes/games"));
api.use("/developers", require("./routes/developers"));
api.use("/publishers", require("./routes/publishers"));
api.use("/genres", require("./routes/genres"));
api.use((req, res) => {
  res.status(404).send({ message: "Not found" });
});

app.use("/api", api);

// * Client

app.use(express.static(STATIC_DIR));

// Let the client-side router handle every other path
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(STATIC_DIR, "index.html"), (err) => {
    if (err) res.status(404).send("Client build not found");
  });
});

// * Server

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Node doesn't exit on SIGTERM when running as PID 1 inside a container
const shutdown = () => {
  server.close(() => process.exit(0));
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
