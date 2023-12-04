const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const User = require("../api/users/users.model");
const usersService = require("../api/users/users.service");

describe("tester API users", () => {
  let token;
  const MOCK_USER_CREATED = {
      _id: "0123456789",
      name: "test",
      email: "test@test.net",
      password: "azertyuiop",
    };
  const MOCK_USER = {
    name: "test",
    email: "test@test.net",
    password: "azertyuiop",
  };
  const MOCK_USER_LIST = [
    MOCK_USER_CREATED
  ];

  beforeEach(() => {
    token = jwt.sign({ userId: MOCK_USER_CREATED._id }, config.secretJwtToken);
    mockingoose(User).toReturn(MOCK_USER_LIST, "find");
    mockingoose(User).toReturn(MOCK_USER_CREATED, "findById");
    mockingoose(User).toReturn(MOCK_USER_CREATED, "save");
    mockingoose(User).toReturn(MOCK_USER_CREATED, "findByIdAndUpdate");
    mockingoose(User).toReturn(MOCK_USER_CREATED, "findOne");
  });

  test("[Users] Create User", async () => {
    const res = await request(app)
      .post("/api/users")
      .send(MOCK_USER);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(MOCK_USER.name);
  });

  test("[Users] Get All", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });


  test("Est-ce userService.getAll", async () => {
    const spy = jest
      .spyOn(usersService, "getAll")
      .mockImplementation(() => "test");
    await request(app).get("/api/users").set("x-access-token", token);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveReturnedWith("test");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});