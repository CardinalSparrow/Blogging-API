const express = require("express");
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");
const { secret, expiresIn } = require("../config/jwt");
const generateToken = (id) => {
  return jwt.sign({ id }, secret, { expiresIn });
};
const User = require("../models/User");
// const {register, login} = require()

const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);

//register
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
    const user = await User.create({ first_name, last_name, email, password });
    if (user) {
      res.status(201).json({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/register", async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/login", (req, res) => {
  res.send("I'm here");
});

module.exports = router;
