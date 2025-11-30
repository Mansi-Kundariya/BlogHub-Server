import express, { type Application } from "express";
import authRoutes from "./routes/auth.routes";
import cors from "cors";
import cookieParser from "cookie-parser"; // for parsing cookies

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.get("/", (req, res) => {
  res.send("API is running with TypeScript 🚀");
});

app.use("/api/auth", authRoutes);

export default app;
