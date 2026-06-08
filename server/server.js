import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import roleMiddleware from "./middleware/roleMiddleware.js";
import clientRoutes from "./routes/clientRoutes.js";

dotenv.config();

const app = express();


app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("FreelanceFlow AI Backend Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);

app.get(
  "/api/admin",
  authMiddleware,
    roleMiddleware("ADMIN"),
    (req, res) => {
        res.json({
            message: "Welcome, admin!",
        });
    }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});