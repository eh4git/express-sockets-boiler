const router = require("express").Router();
router.get("/", async (req, res) => {
  try {
    res.render("home");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/chatroom", async (req, res) => {
  try {
    res.render("chatroom");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/moderated", async (req, res) => {
  try {
    res.render("moderated-chatroom");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
