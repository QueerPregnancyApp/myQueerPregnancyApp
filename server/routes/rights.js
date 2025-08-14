const express = require("express");
const router = express.Router();
const { getRightsByState } = require("../services/rightsService");

router.get("/:state", async (req, res) => {
  try {
    const state = (req.params.state || "").toUpperCase();
    if (!/^[A-Z]{2}$/.test(state))
      return res.status(400).json({ error: "Bad state code" });

    const data = await getRightsByState(state);
    res.json({ state, ...data });
  } catch (e) {
    console.error(e);
    res.status(502).json({ error: "Upstream fetch failed" });
  }
});

module.exports = router;
