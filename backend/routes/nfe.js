import express from "express";
import mdeService from "../services/mdeService.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Protegemos as rotas com middleware de auth
router.use(auth);

// GET /api/nfe?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get("/nfe", async (req, res) => {
  try {
    const { start, end } = req.query;
    const list = await mdeService.listNotas({ start, end });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar NF-e" });
  }
});

// GET /api/xml/:chave
router.get("/xml/:chave", async (req, res) => {
  try {
    const xmlBuffer = await mdeService.downloadXml(req.params.chave);
    res.set("Content-Type", "application/xml");
    res.set(
      "Content-Disposition",
      `attachment; filename="${req.params.chave}.xml"`
    );
    res.send(xmlBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao baixar XML" });
  }
});

// POST /api/manifesto/:chave { tipo }
router.post("/manifesto/:chave", async (req, res) => {
  try {
    const tipo = req.body.tipo || "CIENCIA";
    const result = await mdeService.manifestar(req.params.chave, tipo);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao manifestar" });
  }
});

export default router;
