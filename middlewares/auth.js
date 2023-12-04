const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");
const UserService = require("../api/users/users.service");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw "No token";
    }
    const decoded = jwt.verify(token, config.secretJwtToken);
    // console.log(decoded);
    const user = await UserService.get(decoded.userId); // Récupère l'utilisateur de la base de données
    if (!user) {
      throw "User not found";
    }
    req.user = user; // Maintenant req.user contient toutes les informations de l'utilisateur
    req.decode = decoded;
    next();
  } catch (message) {
    // console.log('erreur ici !!!');
    next(new UnauthorizedError(message));
  }
};
