import express from "express";
import db from "../database.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { playerId, playerName, nivel, pontos, data } = req.body;

  if (!playerId) {
    return res.status(400).json({
      error: "O ID do jogador e obrigatorio."
    });
  }

  const normalizednivel = nivel === undefined ? 1 : Number(nivel);
  const normalizedScore = pontos === undefined ? 0 : Number(pontos);

  if (!Number.isInteger(normalizednivel) || !Number.isInteger(normalizedScore)) {
    return res.status(400).json({
      error: "O nivel e a pontuação devem ser numeros inteiros."
    });
  }

  const serializedData = data === undefined ? null : JSON.stringify(data);
  const sql = `
    INSERT INTO player_progress (player_id, player_name, nivel, pontos, data, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(player_id) DO UPDATE SET
      player_name = excluded.player_name,
      nivel = excluded.nivel,
      pontos = excluded.pontos,
      data = excluded.data,
      updated_at = CURRENT_TIMESTAMP
  `;

  db.run(
    sql,
    [playerId, playerName || null, normalizednivel, normalizedScore, serializedData],
    (error) => {
      if (error) {
        return res.status(500).json({
          error: "Não foi possivel salvar o progresso."
        });
      }

      return res.status(200).json({
        playerId,
        playerName: playerName || null,
        nivel: normalizednivel,
        pontos: normalizedScore,
        data: data === undefined ? null : data
      });
    }
  );
});

router.get("/:playerId", (req, res) => {
  const { playerId } = req.params;

  db.get(
    "SELECT * FROM player_progress WHERE player_id = ?",
    [playerId],
    (error, row) => {
      if (error) {
        return res.status(500).json({
          error: "Não foi possivel buscar o progresso."
        });
      }

      if (!row) {
        return res.status(404).json({
          error: "Progresso não encontrado."
        });
      }

      return res.json({
        id: row.id,
        playerId: row.player_id,
        playerName: row.player_name,
        nivel: row.nivel,
        pontos: row.pontos,
        data: row.data ? JSON.parse(row.data) : null,
        updatedAt: row.updated_at
      });
    }
  );
});

export default router;