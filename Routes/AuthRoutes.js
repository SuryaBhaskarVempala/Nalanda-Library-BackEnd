const express = require("express");
const router = express.Router();
const {signup,login,getUserByToken} = require("../Controllers/AuthRoutesController");


//signup
router.post("/signup", signup);

//login
router.post("/login",login);

//get user by token (this user saves on react context based on this we can easily render nav bar links)
router.post('/', getUserByToken);

module.exports = router;
