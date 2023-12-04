const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const usersService = require("./users.service");
const articlesService = require("../articles/articles.service");

class UsersController {

  async getAll(req, res, next) {
    try {
      const users = await usersService.getAll();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const user = await usersService.get(id);
      if (!user) {
        throw new NotFoundError();
      }
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const user = await usersService.create(req.body);
      user.password = undefined;
      req.io.emit("user:create", user);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const asker = req.user._id.toString();
      const target = req.params.id;
      // console.log(asker, target);
      if ((req.user.role !== 'admin') && (asker !== target)) {
        throw new UnauthorizedError('You are trying to modify an user that is not yourself. You need to be an admin to do that.');
      }
      const data = req.body;
      const userModified = await usersService.update(target, data);
      userModified.password = undefined;
      res.json(userModified);
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      const asker = req.user._id.toString();
      const target = req.params.id;
      if ((req.user.role !== 'admin') && (asker !== target)) {
        throw new UnauthorizedError('You are trying to delete an user that is not yourself. You need to be an admin to do that.');
      }
      await usersService.delete(target);
      req.io.emit("user:delete", { target });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userId = await usersService.checkPasswordUser(email, password);
      if (!userId) {
        throw new UnauthorizedError();
      }
      const token = jwt.sign({ userId }, config.secretJwtToken, {
        expiresIn: "3d",
      });
      res.json({ token });
    } catch (err) {
      next(err);
    }
  }
  async me(req, res, next) {
    try {
        res.json(req.user); // Renvoi simplement les informations intégré pendant l'authentification via le token
    } catch (err) {
        next(err);
    }
  }
  async getArticles(req, res, next) {
    try {
      const userId = req.params.userId;
      // console.log(userId);
      const articles = await articlesService.getByUserId(userId);
      res.json(articles);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UsersController();
