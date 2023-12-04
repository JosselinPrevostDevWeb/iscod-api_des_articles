/**
 * Cette page contient toutes les routes relatives aux utilisateurs ne nécessitant pas un token
 */
const express = require("express");
const usersController = require("./users.controller");
const router = express.Router();

router.post("/", usersController.create); // Je laisse cette route libre d'accès pour pouvoir se créer un compte sans être authentifié
router.get('/:userId/articles', usersController.getArticles);

module.exports = router;
