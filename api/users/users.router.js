const express = require("express");
const usersController = require("./users.controller");
const router = express.Router();

router.post("/", usersController.create);
router.get('/:userId/articles', usersController.getArticles);

module.exports = router;
