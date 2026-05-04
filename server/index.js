import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import ambulanceRoutes from "./routes/ambulanceRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import sosRoutes from "./routes/sosRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { sanitizeBody } from "./middleware/sanitizeBody.js";

dotenv.config();

app.set('trust proxy', 1);
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  }
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(
  cors({
    origin: (process.env.CLIENT_URL || "http://localhost:5173").split(","),
    credentials: true
  })
);
app.use(helmet());
app.set("trust proxy", 1);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 350 }));app.use(mongoSanitize());
app.use(hpp());
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(process.env.UPLOAD_DIR || "uploads"));
app.use(morgan("dev"));
app.use(sanitizeBody);

app.get("/api/health", (req, res) => res.json({ status: "ok", name: "COMTRACK API" }));
app.use("/api/auth", authRoutes);
app.use("/api/ambulance", ambulanceRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

io.on("connection", (socket) => {
  socket.on("join:user", (userId) => {
    socket.join(String(userId));
  });
  socket.on("join:role", (role) => {
    socket.join(`role:${role}`);
  });
  socket.on("disconnect", () => {});
});

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI)
  .then(() => {
    httpServer.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });
