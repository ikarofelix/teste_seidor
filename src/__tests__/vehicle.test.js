import request from "supertest";
import server from "../../src/index.js";

describe("/vehicle Endpoint", () => {
  it("should create a new vehicle", async () => {
    const res = await request(server)
      .post("/vehicle")
      .send({
        placa: "ABC-1234",
        cor: "Blue",
        marca: "Toyota"
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.placa).toEqual("ABC-1234");
  });

  it("should not create a vehicle without placa, cor or marca", async () => {
    const res = await request(server)
      .post("/vehicle")
      .send({
        placa: "ABC-1234",
      });
    expect(res.statusCode).toEqual(400);
  });

  it("should update a vehicle", async () => {
    const res = await request(server)
      .put("/vehicle/1")
      .send({
        placa: "XYZ-5678",
        cor: "Red",
        marca: "Honda"
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.placa).toEqual("XYZ-5678");
  });

  it("should not update a vehicle without placa, cor or marca", async () => {
    const res = await request(server)
      .put("/vehicle/1")
      .send({
        placa: "XYZ-5678",
      });
    expect(res.statusCode).toEqual(400);
  });

  it("should delete a vehicle", async () => {
    const res = await request(server)
      .delete("/vehicle/1");
    expect(res.statusCode).toEqual(204);
  });

  it("should not delete a vehicle that does not exist", async () => {
    const res = await request(server)
      .delete("/vehicle/999");
    expect(res.statusCode).toEqual(404);
  });

  it("should create multiple vehicle", async () => {
    const vehicle = [
      { placa: "ABC-1234", cor: "Blue", marca: "Toyota" },
      { placa: "XYZ-5678", cor: "Red", marca: "Honda" },
      { placa: "DEF-9012", cor: "Green", marca: "Ford" },
    ];

    for (let vehicle of vehicle) {
      const res = await request(server)
        .post("/vehicle")
        .send(vehicle);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toMatchObject(vehicle);
    }
  });

  it("should get all vehicle besides deleted", async () => {
    const res = await request(server)
      .get("/vehicle");

    for (let vehicle of res.body) {
      expect(vehicle.id).not.toBe(1);
    }
  });

  it("should recover a vehicle by id passing new placa, cor and marca", async () => {
    const res = await request(server)
      .put("/vehicle/1")
      .send({
        placa: "ABC-1234",
        cor: "Blue",
        marca: "Toyota"
      });
    expect(res.statusCode).toEqual(200);
    expect(typeof res.body).toBe("object");
  });

  it("should delete a vehicle", async () => {
    const res = await request(server)
      .delete("/vehicle/1");
    expect(res.statusCode).toEqual(204);
  });

  it("should recover a vehicle by id without passing new placa, cor and marca", async () => {
    const res = await request(server)
      .put("/vehicle/1");
    expect(res.statusCode).toEqual(200);
    expect(typeof res.body).toBe("object");
  });

  it("should not recover a vehicle by id", async () => {
    const res = await request(server)
      .put("/vehicle/999");
    expect(res.statusCode).toEqual(404);
  });

  it("should get all vehicle", async () => {
    const res = await request(server)
      .get("/vehicle");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get all vehicle with filter for cor and marca", async () => {
    const res = await request(server)
      .get("/vehicle?cor=red&marca=honda");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toEqual(1);
  });

  it("should get a vehicle by id", async () => {
    const res = await request(server)
      .get("/vehicle/1");
    expect(res.statusCode).toEqual(200);
    expect(typeof res.body).toBe("object");
  });

  it("should not get a vehicle by id", async () => {
    const res = await request(server)
      .get("/vehicle/999");
    expect(res.statusCode).toEqual(404);
    expect(typeof res.body).toBe("object");
  });
});

afterAll(done => {
  server.close(done);
});