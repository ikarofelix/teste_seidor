import request from "supertest";
import server from "../../src/index.js";

describe("/vehicle Endpoint", () => {
  it("should create a new vehicle", async () => {
    const res = await request(server)
      .post("/vehicle")
      .send({
        placa: "ABC-1234",
        cor: "Black",
        marca: "Toyota"
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.placa).toEqual("ABC-1234");
    expect(res.body.cor).toEqual("Black");
    expect(res.body.marca).toEqual("Toyota");
  });

  it("should create multiple vehicles", async () => {
    const vehicle1 = { placa: "ABC-1234", cor: "Black", marca: "Toyota" };
    const vehicle2 = { placa: "XYZ-5678", cor: "White", marca: "Honda" };
  
    const response1 = await request(server).post("/vehicle").send(vehicle1);
    const response2 = await request(server).post("/vehicle").send(vehicle2);
  
    expect(response1.status).toBe(201);
    expect(response1.body).toMatchObject(vehicle1);
  
    expect(response2.status).toBe(201);
    expect(response2.body).toMatchObject(vehicle2);
  });

  it("should not create a vehicle without placa", async () => {
    const vehicle = { cor: "Black", marca: "Toyota" };
  
    const response = await request(server).post("/vehicle").send(vehicle);
  
    expect(response.status).toBe(400);
    expect(response.body.error).toEqual("Veículo inválido! Verifique se os campos placa, cor e marca foram preenchidos corretamente.");
  });

  it("should get all vehicles", async () => {
    const response = await request(server).get("/vehicle");
  
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should get all vehicles with both filters", async () => {
    const cor = "Black";
    const marca = "Toyota";
    const response = await request(server).get(`/vehicle?cor=${cor}&marca=${marca}`);
  
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach(vehicle => {
      expect(vehicle.cor).toBe(cor);
      expect(vehicle.marca).toBe(marca);
    });
  });

  it("should get all vehicles with cor filter", async () => {
    const cor = "Black";
    const response = await request(server).get(`/vehicle?cor=${cor}`);
  
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach(vehicle => {
      expect(vehicle.cor).toBe(cor);
    });
  });

  it("should get all vehicles with marca filter", async () => {
    const marca = "Toyota";
    const response = await request(server).get(`/vehicle?marca=${marca}`);
  
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach(vehicle => {
      expect(vehicle.marca).toBe(marca);
    });
  });

  it("should get a vehicle by id", async () => {
    const response = await request(server).get("/vehicle/1");
  
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(false);
  });

  it("should not get a vehicle with an invalid id", async () => {  
    const response = await request(server).get(`/vehicle/99999`);
  
    expect(response.status).toBe(404);
    expect(response.body.error).toEqual("Veículo com id 99999 não encontrado!");
  });

  it("should delete a vehicle by id", async () => {
    const response = await request(server).delete(`/vehicle/1`);

    expect(response.status).toBe(204);
  });

  it("should not delete a vehicle with an id that does not exist", async () => {
    const response = await request(server).delete(`/vehicle/9999`);

    expect(response.status).toBe(404);
    expect(response.body.error).toEqual("Veículo com id 9999 não encontrado!");
  });

  it("should update a vehicle by id", async () => {
    const updatedData = { placa: "AOW-9999", cor: "Red", marca: "Ford" };
    const response = await request(server).put(`/vehicle/2`).send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ...updatedData, id: 2});
  });

  it("should not update a vehicle with an id that does not exist", async () => {
    const updatedData = { placa: "AOW-9999", cor: "Red", marca: "Ford" };
    const response = await request(server).put(`/vehicle/9999`).send(updatedData);

    expect(response.status).toBe(404);
    expect(response.body.error).toEqual("Veículo com id 9999 não encontrado!");
  });

  it("should not update a vehicle without fields", async () => {
    const updatedData = {};
    const response = await request(server).put(`/vehicle/2`).send(updatedData);

    expect(response.status).toBe(400);
    expect(response.body.error).toEqual("Veículo inválido! Verifique se os campos placa, cor e marca foram preenchidos corretamente.");
  });

  it("should recover a vehicle by id that was deleted without fields", async () => {
    const updatedData = {};
    const response = await request(server).put(`/vehicle/1`).send(updatedData);

    expect(response.status).toBe(200);
  });

  it("should recover a vehicle by id that was deleted with new fields", async () => {
    const response1 = await request(server).delete(`/vehicle/1`);

    expect(response1.status).toBe(204);

    const updatedData = { placa: "AOW-9999", cor: "Red", marca: "Ford" };
    const response2 = await request(server).put(`/vehicle/1`).send(updatedData);

    expect(response2.status).toBe(200);
  });
});

afterAll(done => {
  server.close(done);
});