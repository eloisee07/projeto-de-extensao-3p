import express from "express";
import feedbackRoutes from "./rotas/feedback.js";
import progressRoutes from "./rotas/progresso.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/feedback", feedbackRoutes);
app.use("/api/progress", progressRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Servidor rodando com sucesso!",
    routes: {
      feedback: "POST /api/feedback",
      saveProgress: "POST /api/progress",
      getProgress: "GET /api/progress/:playerId"
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});