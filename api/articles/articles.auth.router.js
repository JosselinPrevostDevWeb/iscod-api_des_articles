/**
 * Cette page contient toutes les routes relatives aux articles nécessitant une authentification
 */
const express = require('express');
const articlesController = require('./articles.controller');
const router = express.Router();

router.post('/', articlesController.create);
router.put('/:id', articlesController.update);
router.delete('/:id', articlesController.delete);

module.exports = router;