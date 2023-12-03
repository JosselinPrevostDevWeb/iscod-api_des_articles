const request = require('supertest');
const { app } = require("../server");
const mockingoose = require('mockingoose');
const Article = require('../api/articles/articles.model');

describe('tester API article', () => {
    beforeEach(() => {
        mockingoose.resetAll();
    });

    it('should return the correct response code for article creation', async () => {
        const response = await request(app)
            .post('/articles')
            .send({ title: 'Test Article', content: 'This is a test article' });

        expect(response.statusCode).toBe(201);
    });

    it('should return the correct response code for article update', async () => {
        const articleId = '1234567890';
        mockingoose(Article).toReturn({ _id: articleId }, 'findOneAndUpdate');

        const response = await request(app)
            .put(`/articles/${articleId}`)
            .send({ title: 'Updated Article', content: 'This is an updated article' });

        expect(response.statusCode).toBe(200);
    });

    it('should return the correct response code for article deletion', async () => {
        const articleId = '1234567890';
        mockingoose(Article).toReturn({ _id: articleId }, 'findOneAndDelete');

        const response = await request(app).delete(`/articles/${articleId}`);

        expect(response.statusCode).toBe(200);
    });
});
