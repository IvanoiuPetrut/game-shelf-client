const express = require("express");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const helmet = require("helmet");
const http = require("http");
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

// How many reverse proxies sit in front of the app (e.g. `1` for Traefik), or
// a comma-separated list of their addresses. Without it every request would
// look like it came from the proxy, so per-client rate limiting would break.
// Leave unset when clients connect directly, so X-Forwarded-For can't be
// spoofed.
const parseTrustProxy = (value) => {
  if (!value) return false;
  return /^\d+$/.test(value) ? Number(value) : value;
};

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", parseTrustProxy(process.env.TRUST_PROXY));

// * Middlewares

// Security headers. The CSP allows the hosts the client loads from: Google
// Fonts, RAWG's image CDN, and trailers, which RAWG serves from varying CDNs.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://media.rawg.io"],
        mediaSrc: ["'self'", "https:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: null,
      },
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xFrameOptions: { action: "deny" },
  }),
);

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

// Every API call can cost RAWG quota, so each client gets a generous budget
// that normal browsing never reaches but scripted abuse quickly does.
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" },
});

app.use("/api", apiLimiter, api);

// * Client

app.use(express.static(STATIC_DIR));

// Let the client-side router handle every other path
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(STATIC_DIR, "index.html"), (err) => {
    if (err) res.status(404).send("Client build not found");
  });
});

// Generic errors (e.g. a malformed URL) never echo details or stack traces
// back to the client, whatever NODE_ENV is set to.
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status >= 400 && err.status < 600 ? err.status : 500;
  if (status >= 500) console.error(err);
  res.status(status).send({ message: http.STATUS_CODES[status] });
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
