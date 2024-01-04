import request from "supertest";
import server from "../../src/index.js";

describe("/usage Endpoint", () => {
  it("should not create a usage without dataInicio, motoristaId, automovelId or motivo", async () => {
    const usageWithoutDataInicio = { motoristaId: 1, automovelId: 1, motivo: "Test" };
    const usageWithoutMotoristaId = { dataInicio: "2022-01-01", automovelId: 1, motivo: "Test" };
    const usageWithoutAutomovelId = { dataInicio: "2022-01-01", motoristaId: 1, motivo: "Test" };
    const usageWithoutMotivo = { dataInicio: "2022-01-01", motoristaId: 1, automovelId: 1 };

    await request(server)
      .post("/usage")
      .send(usageWithoutDataInicio)
      .expect(400)
      .expect({
        error: "Motorista inválido! Verifique se os campos dataInicio, motoristaId, automovelId e motivo foram preenchidos corretamente."
      });

    await request(server)
      .post("/usage")
      .send(usageWithoutMotoristaId)
      .expect(400)
      .expect({
        error: "Motorista inválido! Verifique se os campos dataInicio, motoristaId, automovelId e motivo foram preenchidos corretamente."
      });

    await request(server)
      .post("/usage")
      .send(usageWithoutAutomovelId)
      .expect(400)
      .expect({
        error: "Motorista inválido! Verifique se os campos dataInicio, motoristaId, automovelId e motivo foram preenchidos corretamente."
      });

    await request(server)
      .post("/usage")
      .send(usageWithoutMotivo)
      .expect(400)
      .expect({
        error: "Motorista inválido! Verifique se os campos dataInicio, motoristaId, automovelId e motivo foram preenchidos corretamente."
      });
  });

  it("should create multiple usages", async () => {
    const driver1 = { nome: "John Doe" };
    const vehicle1 = { placa: "ABC-1234", cor: "Blue", marca: "Toyota" };
    const usage1 = { dataInicio: "2022-01-01", motoristaId: 1, automovelId: 1, motivo: "Test 1" };

    const driver2 = { nome: "Jane Doe" };
    const vehicle2 = { placa: "XYZ-5678", cor: "Red", marca: "Honda" };
    const usage2 = { dataInicio: "2022-01-02", motoristaId: 2, automovelId: 2, motivo: "Test 2" };

    await request(server).post("/driver").send(driver1);
    await request(server).post("/vehicle").send(vehicle1);

    const response1 = await request(server)
      .post("/usage")
      .send(usage1);

    expect(response1.status).toBe(201);
    expect(response1.body).toMatchObject({ 
      id: 1, 
      dataInicio: usage1.dataInicio,
      motorista: driver1,
      automovel: vehicle1,
      dataTermino: null 
    });

    await request(server).post("/driver").send(driver2);
    await request(server).post("/vehicle").send(vehicle2);

    const response2 = await request(server)
      .post("/usage")
      .send(usage2);

    expect(response2.status).toBe(201);
    expect(response2.body).toMatchObject({
      id: 2, 
      dataInicio: usage2.dataInicio,
      motorista: driver2,
      automovel: vehicle2,
      dataTermino: null 
    });
  });

  it("should not create a usage with invalid motoristaId", async () => {
    await request(server)
      .post("/usage")
      .send({ 
        dataInicio: "2022-01-01", 
        motoristaId: 999, 
        automovelId: 1, 
        motivo: "Test" 
      })
      .expect(404)
      .expect({ error: "Motorista não encontrado." });
  });

  it("should not create a usage with invalid automovelId", async () => {
    await request(server)
      .post("/usage")
      .send({ 
        dataInicio: "2022-01-01", 
        motoristaId: 1, 
        automovelId: 999, 
        motivo: "Test" 
      })
      .expect(404)
      .expect({ error: "Automóvel não encontrado." });
  });

  it("should not create a usage with an already used automovelId", async () => {
    const driver1 = { nome: "John Doe" };
    const vehicle1 = { placa: "ABC-1234", cor: "Blue", marca: "Toyota" };
    const usage1 = { dataInicio: "2022-01-01", motoristaId: 1, automovelId: 1, motivo: "Test 1" };
  
    const driver2 = { nome: "Jane Doe" };
    const usage2 = { dataInicio: "2022-01-02", motoristaId: 2, automovelId: 1, motivo: "Test 2" };
  
    await request(server).post("/driver").send(driver1);
    await request(server).post("/vehicle").send(vehicle1);
    await request(server).post("/usage").send(usage1);

    await request(server).post("/driver").send(driver2);
  
    const response = await request(server)
      .post("/usage")
      .send(usage2);
  
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ error: "Esse veículo já está em uso." });
  });

  it("should not create a usage with an already used motoristaId", async () => {
    const driver1 = { nome: "John Doe" };
    const vehicle1 = { placa: "ABC-1234", cor: "Blue", marca: "Toyota" };
    const usage1 = { dataInicio: "2022-01-01", motoristaId: 1, automovelId: 2, motivo: "Test 1" };
  
    const driver2 = { nome: "Jane Doe" };
    const vehicle2 = { placa: "XYZ-5678", cor: "Red", marca: "Honda" };
    const usage2 = { dataInicio: "2022-01-02", motoristaId: 1, automovelId: 3, motivo: "Test 2" };
  
    await request(server).post("/driver").send(driver1);
    await request(server).post("/vehicle").send(vehicle1);
    await request(server).post("/usage").send(usage1);
  
    await request(server).post("/driver").send(driver2);
  
    const response = await request(server)
      .post("/usage")
      .send(usage2);
  
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ error: "Esse motorista já está utilizando outro veículo." });
  });

  it("should get all usage and every one have motorista and automovel", async () => {
    const response = await request(server)
      .get("/usage");
  
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  
    response.body.forEach(usage => {
      expect(usage).toHaveProperty("motorista");
      expect(typeof usage.motorista).toBe("object");
  
      expect(usage).toHaveProperty("automovel");
      expect(typeof usage.automovel).toBe("object");
    });
  });

  it("should not end a usage that does not exist", async () => {
    const response = await request(server)
      .put("/usage/9999/end")
      .send({ dataTermino: "2022-01-02" });
  
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Utilização de automóvel com id 9999 não encontrado!");
  });

  it("should not end a usage that does not exist", async () => {
    const response = await request(server)
      .put("/usage/9999/end");
  
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Motorista inválido! Verifique se os campos id e dataTermino foram preenchidos corretamente."
    );
  });

  it("should end a usage", async () => {
    const usage = { dataInicio: "2022-01-01", motoristaId: 3, automovelId: 3, motivo: "Test" };
    const response1 = await request(server).post("/usage").send(usage);
  
    const response2 = await request(server)
      .put(`/usage/${response1.body.id}/end`)
      .send({ dataTermino: "2022-01-03" });
  
    expect(response2.status).toBe(200);
  });

  it("should not end a usage that has already ended", async () => {
    const usage = { dataInicio: "2022-01-01", motoristaId: 4, automovelId: 4, motivo: "Test" };
    const response1 = await request(server).post("/usage").send(usage);
  
    const response2 = await request(server)
      .put(`/usage/${response1.body.id}/end`)
      .send({ dataTermino: "2022-01-03" });
  
    expect(response2.status).toBe(200);

    const response3 = await request(server)
      .put(`/usage/${response1.body.id}/end`)
      .send({ dataTermino: "2022-01-03" });
    
    expect(response3.status).toBe(400);
    expect(response3.body.error).toBe("Essa utilização já foi encerrada.");
  });

  it("should create usage using same data of already ended usage", async () => {
    const usage = { dataInicio: "2022-01-01", motoristaId: 4, automovelId: 4, motivo: "Test" };

    const response = await request(server)
      .post("/usage")
      .send(usage);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ 
      id: response.body.id,
      dataInicio: usage.dataInicio,
      motorista: response.body.motorista,
      automovel: response.body.automovel,
      dataTermino: null 
    });
  });

  it("should not create usage using automovelId that does not exist", async () => {
    const usage = { dataInicio: "2022-01-01", motoristaId: 1, automovelId: 9999, motivo: "Test" };

    const response = await request(server)
      .post("/usage")
      .send(usage);
  
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Automóvel não encontrado.");
  });
});

afterAll(done => {
  server.close(done);
});