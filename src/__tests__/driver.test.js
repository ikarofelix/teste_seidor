import request from "supertest";
import server from "../index.js";

describe("/driver Endpoint", () => {
  it("should create a new driver", async () => {
    const res = await request(server)
      .post("/driver")
      .send({
        nome: "John Doe"
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.nome).toEqual("John Doe");
  });

  it("should not create a driver without nome", async () => {
    const res = await request(server)
      .post("/driver")
      .send({});
    expect(res.statusCode).toEqual(400);
  });

  it("should update a driver", async () => {
    const res = await request(server)
      .put("/driver/1")
      .send({
        nome: "John Doe Updated"
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.nome).toEqual("John Doe Updated");
  });

  it("should not update a driver without placa, cor or marca", async () => {
    const res = await request(server)
      .put("/driver/1")
      .send({});
    expect(res.statusCode).toEqual(400);
  });

  it("should delete a driver", async () => {
    const res = await request(server)
      .delete("/driver/1");
    expect(res.statusCode).toEqual(204);
  });

  it("should not delete a driver that does not exist", async () => {
    const res = await request(server)
      .delete("/driver/999");
    expect(res.statusCode).toEqual(404);
  });

  it("should create multiple driver", async () => {
    const drivers = [
      { nome: "Joane Real" },
      { nome: "Robert For" },
      { nome: "Ed Domingues" },
    ];

    for (let driver of drivers) {
      const res = await request(server)
        .post("/driver")
        .send(driver);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toMatchObject(driver);
    }
  });

  it("should get all driver besides deleted", async () => {
    const res = await request(server)
      .get("/driver");

    for (let driver of res.body) {
      expect(driver.id).not.toBe(1);
    }
  });

  it("should recover a driver by id passing new nome", async () => {
    const res = await request(server)
      .put("/driver/1")
      .send({
        nome: "John Doe Updated"
      });
    expect(res.statusCode).toEqual(200);
    expect(typeof res.body).toBe("object");
  });

  it("should delete a driver", async () => {
    const res = await request(server)
      .delete("/driver/1");
    expect(res.statusCode).toEqual(204);
  });

  it("should recover a driver by id without passing new nome", async () => {
    const res = await request(server)
      .put("/driver/1");
    expect(res.statusCode).toEqual(200);
    expect(typeof res.body).toBe("object");
  });

  it("should not recover a driver by id", async () => {
    const res = await request(server)
      .put("/driver/999")
      .send({
        nome: "John Doe Updated"
      });
    expect(res.statusCode).toEqual(404);
  });

  it("should get all driver", async () => {
    const res = await request(server)
      .get("/driver");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get all driver with filter for cor and marca", async () => {
    const res = await request(server)
      .get("/driver?nome=Robert&For");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toEqual(1);
  });

  it("should get a driver by id", async () => {
    const res = await request(server)
      .get("/driver/1");
    expect(res.statusCode).toEqual(200);
    expect(typeof res.body).toBe("object");
  });

  it("should not get a driver by id", async () => {
    const res = await request(server)
      .get("/driver/999");
    expect(res.statusCode).toEqual(404);
    expect(typeof res.body).toBe("object");
  });
});

afterAll(done => {
  server.close(done);
});