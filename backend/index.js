import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mainRouter from "./src/main.routes.js";
import { errorHandler } from "./src/middleware/error-handler.js";
import db from "./db/db.config.js";


const app = express();


// 1. Core Middlewares
app.use(cors());
app.use(express.json());

// 2. Main API Routes
app.use("/api", mainRouter);

app.use(errorHandler);

// 4. Server and Database Initialization
async function startServer(){
  try {
    app.listen(process.env.DB_PORT, () => {
      console.log("Server is running on port ", process.env.DB_PORT);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

startServer();
