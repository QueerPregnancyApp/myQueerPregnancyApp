const router = require("express").Router();
const { updateJournal } = require("../db/helpers/users");

router.put("/:id", async (req, res, next) => {
  try {
    const journal = await updateJournal(req.params.id, req.body);
    res.send(journal);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
