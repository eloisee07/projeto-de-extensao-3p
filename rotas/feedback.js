import express from "express";
import db from "../database.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { playerName, mensagem, avaliacao } = req.body;

  if (!playerName || !mensagem) {
    return res.status(400).json({
      error: "playerName e mensagem sao obrigatorios."
    });
  }

  const normalizeAvaliacao = avaliacao === undefined ? null : Number(avaliacao);

  if (normalizeAvaliacao !== null && !Number.isInteger(normalizeAvaliacao)) {
    return res.status(400).json({
      error: "A avaliação deve ser um numero inteiro."
    });
  }

  const sql = `
    INSERT INTO feedback (player_name, mensagem, avaliacao)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [playerName, mensagem, normalizeAvaliacao], function insertFeedback(error) {
    if (error) {
      return res.status(500).json({
        error: "Não foi possivel salvar o feedback."
      });
    }

    return res.status(201).json({
      id: this.lastID,
      playerName,
      mensagem,
      avaliacao: normalizeAvaliacao
    });
  });
});

export default router;