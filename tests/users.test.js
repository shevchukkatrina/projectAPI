const request = require("supertest");
const app = require("../app");
const pool = require("../models/db");

describe("GET /instructors", () => {
  it("should return all users", async () => {
    const res = await request(app).get("/instructors");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]).toHaveProperty("first_name");
    expect(res.body[0]).toHaveProperty("last_name");
    expect(res.body[0]).toHaveProperty("middle_name");
  });
});

describe("POST /instructors", () => {
  it("add new instructor", async () => {
    const res = await request(app).post("/instructors").send({
      first_name: "TestFirstName",
      last_name: "TestLastName",
      middle_name: "TestMiddleName",
      phone: "3801234567",
      address: "Test Address, 123",
      birth_date: "1980-01-01",
      start_date: "2020-01-01",
    });

    console.log("body", res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("first_name", "TestFirstName");
    expect(res.body.data).toHaveProperty("last_name", "TestLastName");
    expect(res.body.data).toHaveProperty("middle_name", "TestMiddleName");
    expect(res.body.data).toHaveProperty("phone", "3801234567");
    expect(res.body.data).toHaveProperty("address", "Test Address, 123");
    expect(res.body.data).toHaveProperty("birth_date", "1980-01-01");
    expect(res.body.data).toHaveProperty("start_date", "2020-01-01");
  });
});

describe("DELETE /instructors/:id", () => {
  it("should delete last user from db", async () => {
    const [rows] = await pool.query("SELECT COUNT(*) as count FROM instructor");
    const id = rows.count;
    const response = await request(app).delete(`/instructors/${id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Instructor deleted successfully");
  });
});
