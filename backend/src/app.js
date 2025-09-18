import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import Redis from 'ioredis';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

import authRoutes from './routes/auth.routes.js';
import itemRoutes from './routes/item.routes.js';
import fileRoutes from './routes/file.routes.js';
import shortUrlRoutes from './routes/shortUrl.routes.js';
import noteRoutes from './routes/note.routes.js';
import { redirectToLongUrl } from './controllers/shortUrl.controller.js';

const app = express();

let redisClient;
if (process.env.NODE_ENV !== "test") {
  redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  });

  const limiter = rateLimit({
    store: new RedisStore({
      client: redisClient,
      sendCommand: (...args) => redisClient.call(...args),
    }),
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  });

  app.use(limiter);
}

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/:shortCode", redirectToLongUrl);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api", fileRoutes);
app.use('/api', shortUrlRoutes);
app.use('/', shortUrlRoutes);
app.use("/api", noteRoutes);

app.use((err, req, res, next) => {
  console.error("Backend Error:", err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected error occurred!";
  const errors = err.errors || null;

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ message: "File size too large. Max 5MB allowed." });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: "Too many files or unexpected file field." });
    }
  }
  res.status(statusCode).json({ message, errors });
});

export { redisClient };
export default app;