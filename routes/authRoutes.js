const express = require("express");

const { login, register, getUsers } = require("../controllers/authController");

const router = express.Router();

//register
router.post("/register", register);

router.get("/register", getUsers);

//login

router.post("/login", login);

router.get("/login", (req, res) => {
  res.send("I'm here");
});

module.exports = router;
