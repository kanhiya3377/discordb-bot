require("dotenv").config();
const express       = require("express");
const cors          = require("cors");
const helmet        = require("helmet");
const morgan        = require("morgan");
const rateLimit     = require("express-rate-limit");
const swaggerUi     = require("swagger-ui-express");
const swaggerSpec   = require("./config/swagger");
const { sequelize } = require("./models");
const logger        = require("./config/logger");

// Routes
const authRoutes    = require("./routes/auth");
const userRoutes    = require("./routes/users");
const serviceRoutes = require("./routes/services");

// Error handlers
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ───────────────────────────────────
app.use(helmet());
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "PATCH"] }));

// ─── Rate Limiting ─────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// Auth routes get stricter limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many auth attempts." },
});
app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/auth/signup", authLimiter);

// ─── Body Parsing ──────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ─── Swagger Docs ──────────────────────────────────────────
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Health Check ──────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ success: true, message: "VyomXpress API is running.", env: process.env.NODE_ENV });
});

// ─── API Routes ────────────────────────────────────────────
app.use("/api/v1/auth",     authRoutes);
app.use("/api/v1/users",    userRoutes);
app.use("/api/v1/services", serviceRoutes);

// ─── 404 & Error Handlers ─────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────
const start = async () => {
  try {
    await sequelize.authenticate();
    logger.info("✅ Database connection established.");

    await sequelize.sync({ alter: true });
    logger.info("✅ Models synced.");

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`📚 Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    logger.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
