const express = require("express");
const usersController = require("./users.controller");
const router = express.Router();

router.get('/:userId/articles', usersController.getArticles);
router.post("/", usersController.create);

module.exports = router;
