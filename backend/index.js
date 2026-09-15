import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mainRouter from "./src/main.routes.js";
import { errorHandler } from "./src/middleware/error-handler.js";
const app = express();
import cors from "cors";
app.use(cors());
app.use(express.json());
app.use(errorHandler);
app.use("/api", mainRouter);

async function startServer() {
  try {
    app.listen(9000, (err) => {
      if (err) throw err;
      console.log("server is running on port 9000");
    });
  } catch (err) {
    console.log("something went happened");
  }
}
startServer();
