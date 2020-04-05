const request = require("supertest");
const app = require("../app");
const socket = require("../socket");
const http = require("http");
const Post = require("../models/index").post;
const { Op } = require("sequelize");
let httpServer;
let user = {
  email: `email-forTest${Date.now()}@gmail.com`,
  password: "123456",
  name: "user test",
};
let secondUser = {
  email: `second-email-forTest${Date.now()}@gmail.com`,
  password: "123456",
  name: "second user test",
};
let credentials;
let secondUsercredentials;
beforeAll(async (done) => {
  await request(app).put("/auth/signup").send(user);
  await request(app).put("/auth/signup").send(secondUser);
  let userResponse = await request(app).post("/auth/login").send(user);
  credentials = userResponse.body;
  let secondResponse = await request(app).post("/auth/login").send(secondUser);
  secondUsercredentials = secondResponse.body;
  httpServer = http.createServer();
  socket.init(httpServer);
  done();
});

describe("Tests for list posts", () => {
  test("Should list posts", async () => {
    const response = await request(app)
      .get("/feed/posts")
      .set("authorization", `Bearer ${credentials.token}`);
    expect(response.status).toBe(200);
  });
  test("Shouldn't list posts for no authenticated user", async () => {
    const response = await request(app).get("/feed/posts");
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Not authenticated");
  });
  test("Shouldn't list posts for incorrect token", async () => {
    const response = await request(app)
      .get("/feed/posts")
      .set("authorization", `Bearer myprivatetoken`);
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("jwt malformed");
  });
});
describe("Tests for create post", () => {
  test("Should create a post", async () => {
    const newPost = { title: "My Post", content: "Contente of new post" };
    const response = await request(app)
      .post("/feed/posts")
      .send(newPost)
      .set("authorization", `Bearer ${credentials.token}`);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Post created");
    expect(response.body.post).toHaveProperty("createdAt");
    expect(response.body.post).toHaveProperty("id");
  });
  test("Shouldn't create a post without title", async () => {
    const newPost = { content: "Contente of new post" };
    const response = await request(app)
      .post("/feed/posts")
      .send(newPost)
      .set("authorization", `Bearer ${credentials.token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Title");
  });
  test("Shouldn't create a post without content", async () => {
    const newPost = { title: "My Post" };
    const response = await request(app)
      .post("/feed/posts")
      .send(newPost)
      .set("authorization", `Bearer ${credentials.token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid text for content");
  });
  test("Shouldn't create posts for no authenticated user", async () => {
    const newPost = { title: "My Post", content: "Contente of new post" };
    const response = await request(app).post("/feed/posts").send(newPost);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Not authenticated");
  });
  test("Shouldn't create posts for incorrect token", async () => {
    const newPost = { title: "My Post", content: "Contente of new post" };
    const response = await request(app)
      .post("/feed/posts")
      .send(newPost)
      .set("authorization", `Bearer myprivatetoken`);
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("jwt malformed");
  });
});
describe("Tests for get a post", () => {
  let post;
  beforeAll(async (done) => {
    post = await Post.findOne({ raw: true });
    done();
  });
  test("Should get a posts by ID", async () => {
    const response = await request(app)
      .get(`/feed/post/${post.id}`)
      .set("authorization", `Bearer ${credentials.token}`);
    expect(response.status).toBe(200);
    expect(response.body.post.id).toBe(post.id);
    expect(response.body.post.deletedAt).toBeNull();
  });
  test("Shouldn't get a posts with invalid ID", async () => {
    const response = await request(app)
      .get(`/feed/post/${-1}`)
      .set("authorization", `Bearer ${credentials.token}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Could not find post");
  });
  test("Shouldn't get a post by ID for no authenticated user", async () => {
    const response = await request(app).get(`/feed/post/${post.id}`);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Not authenticated");
  });
  test("Shouldn't get a post for incorrect token", async () => {
    const newPost = { title: "My Post", content: "Contente of new post" };
    const response = await request(app)
      .get(`/feed/post/${post.id}`)
      .send(newPost)
      .set("authorization", `Bearer myprivatetoken`);
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("jwt malformed");
  });
});
describe("Tests for update a post", () => {
  let post;
  let postForOtherUser;
  beforeAll(async (done) => {
    post = await Post.create({
      title: "Post for update",
      content: "dumb",
      creator_id: credentials.userId,
    });
    postForOtherUser = await Post.create({
      title: "Post for not update",
      content: "dumb",
      creator_id: secondUsercredentials.userId,
    });
    done();
  });
  test("Should update a posts by ID", async () => {
    const response = await request(app)
      .put(`/feed/post/${post.id}`)
      .send({
        title: "Update title",
        content: "Update content",
        creator_id: credentials.userId,
      })
      .set("authorization", `Bearer ${credentials.token}`);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Post updated");
  });
  test("Shouldn't update a posts of another user", async () => {
    const response = await request(app)
      .put(`/feed/post/${post.id}`)
      .send({
        title: "Update title",
        content: "Update content",
        creator_id: postForOtherUser.creator_id,
      })
      .set("authorization", `Bearer ${credentials.token}`);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Not authorized");
  });
  test("Shouldn't update a posts without title", async () => {
    const response = await request(app)
      .put(`/feed/post/${post.id}`)
      .send({
        content: "Update content",
        creator_id: credentials.userId,
      })
      .set("authorization", `Bearer ${credentials.token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Title");
  });
  test("Shouldn't update a posts without content", async () => {
    const response = await request(app)
      .put(`/feed/post/${post.id}`)
      .send({
        title: "Update title",
        creator_id: credentials.userId,
      })
      .set("authorization", `Bearer ${credentials.token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid text for content");
  });
  test("Shouldn't update a post for no authenticated user", async () => {
    const response = await request(app).put(`/feed/post/${post.id}`).send({
      title: "Update title",
      content: "Update content",
      creator_id: credentials.userId,
    });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Not authenticated");
  });
  test("Shouldn't update a post for incorrect token", async () => {
    const response = await request(app)
      .put(`/feed/post/${post.id}`)
      .send({
        title: "Update title",
        content: "Update content",
        creator_id: postForOtherUser.creator_id,
      })
      .set("authorization", `Bearer myprivatetoken`);
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("jwt malformed");
  });
});
describe("Tests for delete a post", () => {
  let post;
  let postForOtherUser;
  beforeAll(async (done) => {
    post = await Post.create({
      title: "Post for delete",
      content: "dumb",
      creator_id: credentials.userId,
    });
    postForOtherUser = await Post.create({
      title: "Post for not delete",
      content: "dumb",
      creator_id: secondUsercredentials.userId,
    });
    done();
  });
  test("Should delete a posts by ID", async () => {
    const response = await request(app)
      .delete(`/feed/post/${post.id}`)
      .send({ creator_id: credentials.userId })
      .set("authorization", `Bearer ${credentials.token}`);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Post deleted");
  });
  test("Shouldn't delete a posts of another user", async () => {
    const response = await request(app)
      .delete(`/feed/post/${postForOtherUser.id}`)
      .send({ creator_id: postForOtherUser.creator_id })
      .set("authorization", `Bearer ${credentials.token}`);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Not authorized");
  });
  test("Shouldn't delete posts with invalid ID", async () => {
    const response = await request(app)
      .delete(`/feed/post/${post.id}`)
      .send({ creator_id: credentials.userId })
      .set("authorization", `Bearer ${credentials.token}`);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Post deleted");
  });
  test("Shouldn't delete a post for no authenticated user", async () => {
    const response = await request(app)
      .delete(`/feed/post/${post.id}`)
      .send({ creator_id: credentials.userId });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Not authenticated");
  });
  test("Shouldn't update a post for incorrect token", async () => {
    const response = await request(app)
      .delete(`/feed/post/${post.id}`)
      .send({ creator_id: credentials.userId })
      .set("authorization", `Bearer myprivatetoken`);
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("jwt malformed");
  });
});
afterAll(async (done) => {
  socket.getIO().close();
  httpServer.close();
  Post.destroy({ where: {} });
  done();
});
