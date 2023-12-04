const request = require('supertest');
const { app } = require("../server");
const jwt = require('jsonwebtoken');
const config = require('../config');
const mockingoose = require('mockingoose');
const mongoose = require('mongoose');
const Article = require('../api/articles/articles.model');
const User = require("../api/users/users.model");


describe('tester API article', () => {
    let token;
    const MOCK_USER_CREATED = {
          _id: '0123456789',
          name: "test",
          email: "test@test.net",
          password: "azertyuiop",
          role: "member"
    };

    const MOCK_ARTICLE = {
        title: 'Test Article',
        content: 'This is a test article',
    };
    const MOCK_ARTICLE_CREATED = {
          _id: '9876543210',
          title: 'Test Article',
          content: 'This is a test article',
          user: MOCK_USER_CREATED._id,
          statut: 'draft'
    };
    const MOCK_ARTICLE_UP = {
    title: 'Updated Article',
        content: 'This is an updated article',
    };
    const MOCK_ARTICLE_UPDATED = {
        _id: MOCK_ARTICLE_CREATED._id,
        title: 'Updated Article',
        content: 'This is an updated article',
        user: MOCK_USER_CREATED._id,
        statut: 'draft'
    }
    const MOCK_ARTICLE_LIST = [
        MOCK_ARTICLE_CREATED
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        token = jwt.sign({ userId: MOCK_USER_CREATED._id }, config.secretJwtToken);

        mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "save");
        Article.find = jest.fn().mockResolvedValue(MOCK_ARTICLE_LIST);
        Article.findByIdAndUpdate = jest.fn().mockResolvedValue(MOCK_ARTICLE_UPDATED);
        Article.findOne = jest.fn().mockResolvedValue(MOCK_ARTICLE_CREATED);
        Article.findById = jest.fn().mockResolvedValue(MOCK_ARTICLE_CREATED);
    });

    afterEach(() => {
        jest.restoreAllMocks();
        mockingoose.resetAll();
    });

    it('[Articles] Creation', async () => {
        // Mockage ici car incompatible avec le test => '[Articles] Update'
        mockingoose(User).toReturn(MOCK_USER_CREATED, "findOne");

        const response = await request(app)
            .post('/api/articles')
            .send(MOCK_ARTICLE)
            .set('x-access-token', token);
        expect(response.status).toBe(201);
        expect(response.body.title).toBe(MOCK_ARTICLE_CREATED.title);
    });

    it('[Articles] Update', async () => {
        // Mockage ici car incompatible avec le test => '[Articles] Creation'
        User.findOne = jest.fn().mockResolvedValue(MOCK_USER_CREATED);

        const response = await request(app)
            .put(`/api/articles/${MOCK_ARTICLE_CREATED._id}`)
            .send(MOCK_ARTICLE_UP)
            .set('x-access-token', token);
        console.log(response.status);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(MOCK_ARTICLE_UPDATED.title);
    });

    it('[Articles] deletion', async () => {
        const response = await request(app)
            .delete(`/api/articles/${MOCK_ARTICLE_CREATED._id}`)
            .set('x-access-token', token);
        expect(response.status).toBe(204);
    });
});
