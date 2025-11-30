import express from "express";
import fetch from "node-fetch";

const app = express();

// Route racine pour tester si le serveur fonctionne
app.get("/", (req, res) => {
  res.send("API Overwatch Rank est en ligne ✅ Utilise /ow_rank?battletag=TON_BATTLETAG");
});

// Endpoint principal pour les rangs Overwatch
app.get("/ow_rank", async (req, res) => {
  const tag = req.query.battletag;
  if (!tag) return res.send("BattleTag manquant ❌");

  try {
    const response = await fetch(`https://overfast-api.tekrop.fr/players/${tag}/summary`);
    const data = await response.json();

    const comp = data.competitive?.pc;
    if (!comp) return res.send("Aucune donnée compétitive trouvée 😢");

    const tank = comp.tank?.division || "Inconnu";
    const dps = comp.damage?.division || "Inconnu";
    const support = comp.support?.division || "Inconnu";
    const any = comp.any?.division || "Inconnu"; // sélection libre

    res.send(`Tank: ${tank} | DPS: ${dps} | Support: ${support} | Sélection libre: ${any}`);
  } catch (e) {
    res.send("Impossible de lire les données 😢");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API prête sur le port ${PORT}`));
