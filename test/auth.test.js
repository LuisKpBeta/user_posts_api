const request = require("supertest");
const app = require("../app");
let user = {
  email: `email${Date.now()}@gmail.com`,
  password: "123456",
  name: "user test",
};
describe("Tests for SignUp user", () => {
  test("Should SignUp an user", async () => {
    const response = await request(app).put("/auth/signup").send(user);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("User created");
  });
  test("Shouldn't sign up without email", async () => {
    const response = await request(app)
      .put("/auth/signup")
      .send({ ...user, email: "" });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Please enter a email");
  });
  test("Shouldn't sign up without name", async () => {
    const response = await request(app)
      .put("/auth/signup")
      .send({
        email: `email${Date.now()}@gmail.com`,
        password: "123456",
        name: "",
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Please enter a valid name");
  });
  test("Shouldn't sign up without password", async () => {
    const response = await request(app)
      .put("/auth/signup")
      .send({
        email: `email${Date.now()}@gmail.com`,
        password: "",
        name: "user test",
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Password is too short");
  });
  test("Shouldn't sign up with a short password", async () => {
    const response = await request(app)
      .put("/auth/signup")
      .send({
        email: `email${Date.now()}@gmail.com`,
        password: "123",
        name: "user test",
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Password is too short");
  });
  test("Shouldn't sign up an with an existing email", async () => {
    const response = await request(app).put("/auth/signup").send(user);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("E-mail address already existis!");
  });
});
describe("Tests for Login user", () => {
  let loginUser = {
    email: user.email,
    password: user.password,
  };
  test("Should Login an user", async () => {
    const response = await request(app).post("/auth/login").send(loginUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("userId");
  });
  test("Shouldn't Login an user without email", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ ...loginUser, email: "" });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Please enter a email");
  });
  test("Shouldn't Login an user without password", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ ...loginUser, password: "" });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Password is too short");
  });
  test("Shouldn't Login an user with a not existing email", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ ...loginUser, email: "no-exist@email.com" });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "A user with this email could not be found"
    );
  });
  test("Shouldn't Login an user with wrong password", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ ...loginUser, password: "123456789" });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Wrong password");
  });
});
