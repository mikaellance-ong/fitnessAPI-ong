const express = require("express");
const userController = require("../controllers/user");

const auth = require("../auth");

const { verify } = auth;

const router = express.Router();

router.post("/register", userController.register);

router.post("/login", userController.login);

router.get("/details", verify, userController.getUserDetails);

module.exports = router;