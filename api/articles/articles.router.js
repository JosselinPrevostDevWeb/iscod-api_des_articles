/**
 * Cette page contient toutes les routes relatives aux articles ne nécessitant pas un token
 */
const express = require('express');
const articlesController = require('./articles.controller');
const router = express.Router();

router.get('/', articlesController.getAll);
router.get('/:id', articlesController.getById);

module.exports = router;