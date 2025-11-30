import express, { type Application } from "express";
import authRoutes from "./routes/auth.routes";
import blogRoutes from "./routes/blog.routes";
import cors from "cors";
import cookieParser from "cookie-parser"; // for parsing cookies

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is running with TypeScript 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);

export default app;
