import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/", (req, res) => {
  res.send("API Overwatch Rank est en ligne ✅ Utilise /ow_rank?battletag=TON_BATTLETAG");
});

app.get("/ow_rank", async (req, res) => {
  const tag = req.query.battletag;
  if (!tag) return res.send("BattleTag manquant ❌");

  try {
    const response = await fetch(`https://overfast-api.tekrop.fr/players/${tag}/summary`);
    const data = await response.json();

    const comp = data.competitive?.pc;
    if (!comp) return res.send("Aucune donnée compétitive trouvée 😢");

    const tank = comp.tank ? `${comp.tank.division} ${comp.tank.tier}` : "Inconnu";
    const dps = comp.damage ? `${comp.damage.division} ${comp.damage.tier}` : "Inconnu";
    const support = comp.support ? `${comp.support.division} ${comp.support.tier}` : "Inconnu";
    const open = comp.open ? `${comp.open.division} ${comp.open.tier}` : "Inconnu"; // sélection libre

    res.send(`Tank: ${tank} | DPS: ${dps} | Support: ${support} | Sélection libre: ${open}`);
  } catch (e) {
    console.error(e);
    res.send("Impossible de lire les données 😢");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API prête sur le port ${PORT}`));
