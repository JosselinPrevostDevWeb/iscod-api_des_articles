const Article = require('./articles.model');

class ArticlesServices {
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

    async getByUserId(userId) {
        return await Article.find({ author: userId }).populate('author', '-password');
    }
}

module.exports = new ArticlesServices();
