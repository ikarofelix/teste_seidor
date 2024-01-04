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

  it("should create multiple drivers", async () => {
    const driver1 = { nome: "Driver 1" };
    const driver2 = { nome: "Driver 2" };
  
    const response1 = await request(server).post("/driver").send(driver1);
    const response2 = await request(server).post("/driver").send(driver2);
  
    expect(response1.status).toBe(201);
    expect(response1.body).toMatchObject({ ...driver1, id: 2 });
  
    expect(response2.status).toBe(201);
    expect(response2.body).toMatchObject({ ...driver2, id: 3 });
  });

  it("should not create a driver without nome", async () => {
    const driver = { idade: 30 };
  
    const response = await request(server).post("/driver").send(driver);
  
    expect(response.status).toBe(400);
    expect(response.body.error).toEqual("Motorista inválido! Verifique se o campo nome foi preenchido corretamente.");
  });

  it("should get all drivers", async () => {
    const response = await request(server).get("/driver");
  
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should get all drivers with a filter", async () => {
    const nome = "Driver 2";
    const response = await request(server).get(`/driver?nome=${nome}`);
  
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach(driver => {
      expect(driver.nome).toBe(nome);
    });
  });

  it("should get a driver by id", async () => {
    const response = await request(server).get("/driver/1");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(false);
  });

  it("should not get a driver with an invalid id", async () => {  
    const response = await request(server).get(`/driver/99999`);
  
    expect(response.status).toBe(404);
    expect(response.body.error).toEqual("Motorista com id 99999 não encontrado!");
  });

  it("should delete a driver by id", async () => {
    const response = await request(server).delete(`/driver/1`);

    expect(response.status).toBe(204);
  });

  it("should not delete a driver with an id that does not exist", async () => {
    const response = await request(server).delete(`/driver/9999`);

    expect(response.status).toBe(404);
    expect(response.body.error).toEqual("Motorista com id 9999 não encontrado!");
  });

  it("should update a driver by id", async () => {
    const updatedData = { nome: "Updated Driver" };
    const response = await request(server).put(`/driver/2`).send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ...updatedData, id: 2});
  });

  it("should not update a driver with an id that does not exist", async () => {
    const updatedData = { nome: "Updated Driver" };
    const response = await request(server).put(`/driver/9999`).send(updatedData);

    expect(response.status).toBe(404);
    expect(response.body.error).toEqual("Motorista com id 9999 não encontrado!");
  });

  it("should not update a driver without nome", async () => {
    const updatedData = {};
    const response = await request(server).put(`/driver/2`).send(updatedData);

    expect(response.status).toBe(400);
    expect(response.body.error).toEqual("Motorista inválido! Verifique se os campo nome foi preenchido corretamente.");
  });

  it("should recover a driver by id that was deleted without nome", async () => {
    const updatedData = {};
    const response = await request(server).put(`/driver/1`).send(updatedData);

    expect(response.status).toBe(200);
  });

  it("should recover a driver by id that was deleted with new nome", async () => {
    const response1 = await request(server).delete(`/driver/1`);

    expect(response1.status).toBe(204);

    const updatedData = { nome: "Recovered Driver" };
    const response2 = await request(server).put(`/driver/1`).send(updatedData);

    expect(response2.status).toBe(200);
  });
});

afterAll(done => {
  server.close(done);
});