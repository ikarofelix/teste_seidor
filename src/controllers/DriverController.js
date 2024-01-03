import driverData from "../data/driver.js";

export function getDrivers(req, res) {
  const { nome } = req.query;

  let filteredDrivers = [...driverData.filter(driver => !driver.deleted)];

  if (nome) {
    filteredDrivers = filteredDrivers.filter(
      driver => driver.nome.toLowerCase().includes(nome.toLowerCase())
    );
  }

  return res.send(filteredDrivers);
}

export function getDriverById(req, res) {
  const { id } = req.params;

  const driver = driverData.find(driver => driver.id === Number(id));

  if (!driver) {
    return res.status(404).send(`Motorista com id ${id} não encontrado!`);
  }

  if (driver.deleted) {
    delete driver.deleted;
  }

  return res.send(driver);
}

export function deleteDriver(req, res) {
  const { id } = req.params;

  const driverIndex = driverData.findIndex(driver => driver.id === Number(id));

  if (driverIndex < 0) {
    return res.status(404).send(`Motorista com id ${id} não encontrado!`);
  }

  driverData[driverIndex].deleted = true;

  return res.status(204).send();
}

export function createDriver(req, res) {
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).send(`Motorista inválido! Verifique se os campo nome foi preenchido corretamente.`);
  }

  const newDriver = {
    id: driverData.length + 1,
    nome
  };

  driverData.push(newDriver);

  return res.status(201).send(newDriver);
}

export function updateDriver(req, res) {
  const { id } = req.params;
  const { nome } = req.body;

  const driver = driverData.find(driver => driver.id === Number(id));

  if (!driver || driver.deleted) {
    return res.status(404).send(`Motorista com id ${id} não encontrado!`);
  }

  if (!nome) {
    return res.status(400).send(`Motorista inválido! Verifique se os campo nome foi preenchido corretamente.`);
  }

  driver.nome = nome;

  return res.send(driver);
}