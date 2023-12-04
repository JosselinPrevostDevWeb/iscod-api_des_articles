const Article = require('./articles.model');

class ArticlesServices {
    getAll() {
        return Article.find({});
    };
    get(id) {
        return Article.findById(id);
    };
    create(data) {
        const article = new Article(data);
        return article.save();
    };

    update(id, data) {
        return Article.findByIdAndUpdate(id, data, { new: true });
    };

    delete(id) {
        return  Article.deleteOne({ _id: id });
    };

    // Pour alimenter la route 'api/users/:userId/articles'
    getByUserId(userId) {
        return Article.find({ user: userId }).populate('user', '-password');
    }
}

module.exports = new ArticlesServices();
