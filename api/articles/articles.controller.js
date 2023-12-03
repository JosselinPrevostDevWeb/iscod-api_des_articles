const articlesService = require('./articles.service');

class ArticlesController {
    async create(req, res, next) {
        try {
            const data = req.body;
            if (req.user._id) {
              data.userId = req.user._id; // Ajoute l'ID de l'utilisateur à l'objet data
            } else {
              return res.status(403).json({ message: 'Forbidden' });
            }
            const article = await articlesService.create(data);
            req.io.emit("article:create", article);
            res.status(201).json(article);
        } catch (error) {
            next(error)
        }
    };
    
    async update(req, res, next) {
        try {
          if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
          }
          const id = req.params.id;
          const data = req.body;
          const article = await articlesService.update(id, data);
          res.json(article);
        } catch (error) {
          next(error);
        }
    };
    
    async delete(req, res, next) {
        try {
          if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
          }
          const id = req.params.id;
          await articlesService.delete(id);
          req.io.emit("article:delete", { id });
          res.status(204).end();
        } catch (error) {
          next(error);
        }
    };
}

module.exports = new ArticlesController();
