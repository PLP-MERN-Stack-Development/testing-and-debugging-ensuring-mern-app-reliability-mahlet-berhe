// posts.test.js - Integration tests for posts API endpoints (CommonJS)

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../src/app");
const Post = require("../../src/models/Post");
const User = require("../../src/models/User");

let mongoServer;
let userId;
let postId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create a test user
  const user = await User.create({
    username: "testuser",
    email: "test@example.com",
    password: "password123",
  });
  userId = user._id;

  // Create a test post
  const post = await Post.create({
    title: "Test Post",
    content: "This is a test post content",
    author: userId,
    category: "general",
    slug: "test-post",
  });
  postId = post._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    if (!["users", "posts"].includes(collection.collectionName)) {
      await collection.deleteMany({});
    }
  }
});

describe("POST /api/posts", () => {
  it("creates a new post (201)", async () => {
    const newPost = {
      title: "New Test Post",
      content: "This is a new test post content",
      author: userId.toString(),
      category: "tech",
      slug: "new-test-post",
    };
    const res = await request(app).post("/api/posts").send(newPost);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe(newPost.title);
  });

  it("returns 400 if validation fails", async () => {
    const invalidPost = { content: "Missing title" };
    const res = await request(app).post("/api/posts").send(invalidPost);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});

describe("GET /api/posts", () => {
  it("returns all posts", async () => {
    const res = await request(app).get("/api/posts");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("filters by category", async () => {
    await Post.create({
      title: "Filtered Post",
      content: "Filter category",
      author: userId,
      category: "filter-me",
      slug: "filtered-post",
    });
    const res = await request(app).get("/api/posts?category=filter-me");
    expect(res.status).toBe(200);
    expect(res.body[0].category).toBe("filter-me");
  });

  it("paginates results", async () => {
    const bulk = [];
    for (let i = 0; i < 15; i++) {
      bulk.push({
        title: `Pagination Post ${i}`,
        content: `Content for pagination test ${i}`,
        author: userId,
        category: "cat",
        slug: `pagination-post-${i}`,
      });
    }
    await Post.insertMany(bulk);

    const page1 = await request(app).get("/api/posts?page=1&limit=10");
    const page2 = await request(app).get("/api/posts?page=2&limit=10");

    expect(page1.status).toBe(200);
    expect(page2.status).toBe(200);
    expect(page1.body.length).toBe(10);
    expect(page2.body.length).toBeGreaterThan(0);
    expect(page1.body[0]._id).not.toBe(page2.body[0]._id);
  });
});

describe("GET /api/posts/:id", () => {
  it("returns a post by ID", async () => {
    const res = await request(app).get(`/api/posts/${postId}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(postId.toString());
  });

  it("returns 404 for non-existent post", async () => {
    const res = await request(app).get(`/api/posts/${new mongoose.Types.ObjectId()}`);
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/posts/:id", () => {
  it("updates a post", async () => {
    const res = await request(app).put(`/api/posts/${postId}`).send({ title: "Updated Title" });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Title");
  });
});

describe("DELETE /api/posts/:id", () => {
  it("deletes a post", async () => {
    const res = await request(app).delete(`/api/posts/${postId}`);
    expect(res.status).toBe(200);
    const deleted = await Post.findById(postId);
    expect(deleted).toBeNull();
  });
});