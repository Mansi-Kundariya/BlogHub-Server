import app from "./app";
import dotenv from "dotenv";
import { sequelize } from "./models";

dotenv.config();

sequelize
  .authenticate()
  // .sync()
  // .sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("DB Sync Error:", err));

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
