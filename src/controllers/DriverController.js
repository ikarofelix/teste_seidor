import driverData from "../data/driver.js";

export function getDrivers(req, res) {
  const { nome } = req.query;

  let filteredDrivers = [...driverData.filter(driver => !driver.deleted)];

  if (nome) {
    filteredDrivers = filteredDrivers.filter(
      driver => driver.nome.toLowerCase().includes(nome.toLowerCase())
    );
  }

  return res.json(filteredDrivers);
}

export function getDriverById(req, res) {
  const { id } = req.params;

  const driver = driverData.find(driver => driver.id === Number(id));

  if (!driver || driver.deleted) {
    return res.status(404).json({ error: `Motorista com id ${id} não encontrado!` });
  }

  return res.json(driver);
}

export function deleteDriver(req, res) {
  const { id } = req.params;

  const driverIndex = driverData.findIndex(driver => driver.id === Number(id));

  if (driverIndex < 0) {
    return res.status(404).json({ error: `Motorista com id ${id} não encontrado!` });
  }

  driverData[driverIndex].deleted = true;

  return res.status(204).json();
}

export function createDriver(req, res) {
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ 
      error: "Motorista inválido! Verifique se os campo nome foi preenchido corretamente." 
    });
  }

  const newDriver = {
    id: driverData.length + 1,
    nome
  };

  driverData.push(newDriver);

  return res.status(201).json(newDriver);
}

export function updateDriver(req, res) {
  const { id } = req.params;
  const { nome } = req.body;

  const driver = driverData.find(driver => driver.id === Number(id));

  if (!driver) {
    return res.status(404).json({ error: `Motorista com id ${id} não encontrado!` });
  }

  if (!nome && !driver.deleted) {
    return res.status(400).json({ 
      error: "Motorista inválido! Verifique se os campo nome foi preenchido corretamente."
    });
  }

  if (driver.deleted) {
    delete driver.deleted;
  }

  driver.nome = nome || driver.nome;

  return res.json(driver);
}