import express, { type Application } from "express";
import authRoutes from "./routes/auth.routes";

const app: Application = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running with TypeScript 🚀");
});

app.use("/api/auth", authRoutes);

export default app;
