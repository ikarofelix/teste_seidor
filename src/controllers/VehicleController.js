import vehicleData from "../data/vehicle.js";

export function getVehicles(req, res) {
  const { cor, marca } = req.query;

  let filteredVehicles = [...vehicleData.filter(vehicle => !vehicle.deleted)];

  if (cor) {
    filteredVehicles = filteredVehicles.filter(
      vehicle => vehicle.cor.toLowerCase() === cor.toLowerCase()
    );
  }

  if (marca) {
    filteredVehicles = filteredVehicles.filter(
      vehicle => vehicle.marca.toLowerCase() === marca.toLowerCase()
    );
  }

  return res.send(filteredVehicles);
}

export function getVehicleById(req, res) {
  const { id } = req.params;

  const vehicle = vehicleData.find(vehicle => vehicle.id === Number(id));

  if (!vehicle) {
    return res.status(404).send(`Veículo com id ${id} não encontrado!`);
  }

  if (vehicle.deleted) {
    delete vehicle.deleted;
  }

  return res.send(vehicle);
}

export function deleteVehicle(req, res) {
  const { id } = req.params;

  const vehicleIndex = vehicleData.findIndex(vehicle => vehicle.id === Number(id));

  if (vehicleIndex < 0) {
    return res.status(404).send(`Veículo com id ${id} não encontrado!`);
  }

  vehicleData[vehicleIndex].deleted = true;

  return res.status(204).send();
}

export function createVehicle(req, res) {
  const { placa, cor, marca } = req.body;
  if (!placa || !cor || !marca) {
    return res.status(400).send(`Veículo inválido! Verifique se os campos placa, cor e marca foram preenchidos corretamente.`);
  }

  const newVehicle = {
    id: vehicleData.length + 1,
    placa,
    cor,
    marca
  };

  vehicleData.push(newVehicle);

  return res.status(201).send(newVehicle);
}

export function updateVehicle(req, res) {
  const { id } = req.params;
  const { placa, cor, marca } = req.body;

  const vehicle = vehicleData.find(vehicle => vehicle.id === Number(id));

  if (!vehicle || vehicle.deleted) {
    return res.status(404).send(`Veículo com id ${id} não encontrado!`);
  }

  if (!placa || !cor || !marca) {
    return res.status(400).send(`Veículo inválido! Verifique se os campos placa, cor e marca foram preenchidos corretamente.`);
  }

  vehicle.placa = placa;
  vehicle.cor = cor;
  vehicle.marca = marca;

  return res.send(vehicle);
}