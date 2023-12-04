const articlesService = require('./articles.service');
const usersService = require('../users/users.service');
const UnauthorizedError = require('../../errors/unauthorized');

class ArticlesController {
    async getAll(req, res, next) {
      try {
        const articles = await articlesService.getAll();
        res.json(articles);
      } catch (err) {
        next(err);
      }
    }
    async getById(req, res, next) {
      try {
        const id = req.params.id;
        const article = await articlesService.get(id);
        if (!article) {
          throw new NotFoundError();
        }
        res.json(article);
      } catch (err) {
        next(err);
      }
    }
    async create(req, res, next) {
        try {
            const data = req.body;
            data.user = req.user._id;
            const article = await articlesService.create(data);
            req.io.emit("article:create", article);
            res.status(201).json(article);
        } catch (error) {
            next(error)
        }
    };

    async update(req, res, next) {
        try {
          const articleId = req.params.id;
          const article = await articlesService.get(articleId);
          // console.log(article);
          const articleOwner = article.user.toString();
          const asker = req.user._id.toString();
          // console.log('Update article for ' + articleOwner);
          if ((req.user.role !== 'admin') && (articleOwner !== asker)) {
            throw new UnauthorizedError('Forbidden, you must be the owner or admin for update article');
          }
          const data = req.body;
          const newArticle = await articlesService.update(articleId, data);
          res.json(newArticle);
        } catch (error) {
          next(error);
        }
    };

    async delete(req, res, next) {
        try {
          const articleId = req.params.id;
          const article = await articlesService.get(articleId);
          const articleOwner = article.user.toString();
          const asker = req.user._id.toString();
          if ((req.user.role !== 'admin') && (articleOwner !== asker)) {
            throw new UnauthorizedError('Forbidden, you must be the owner or admin for update article');
          }
          await articlesService.delete(articleId);
          req.io.emit("article:delete", { articleId });
          res.status(204).end();
        } catch (error) {
          next(error);
        }
    };
}

module.exports = new ArticlesController();
