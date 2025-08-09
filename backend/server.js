import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/characters", userRoutes);

// Route par défaut
app.get("/", (req, res) => {
  res.json({ message: "Backend Express Marvel API" });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});