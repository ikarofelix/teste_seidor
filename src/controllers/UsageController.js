import usageData from "../data/usage.js";
import driverData from "../data/driver.js";
import vehicleData from "../data/vehicle.js";

export function getUsages(_, res) {
  return res.send(usageData);
}

export function createUsage(req, res) {
  const { 
    dataInicio, 
    motoristaId, 
    automovelId, 
    motivo 
  } = req.body;

  if (!dataInicio || !motoristaId || !automovelId || !motivo) {
    return res.status(400).json({ 
      error: "Motorista inválido! Verifique se os campos dataInicio, motoristaId, automovelId e motivo foram preenchidos corretamente."
    });
  }

  if (!driverData.find(driver => driver.id === motoristaId && !driver.deleted)) {
    return res.status(404).json({ error: "Motorista não encontrado." });
  }

  if (!vehicleData.find(vehicle => vehicle.id === automovelId && !vehicle.deleted)) {
    return res.status(404).json({ error: "Automóvel não encontrado." });
  }

  const existingVehicleUsage = usageData.find(
    usage => usage.automovel.id === automovelId && usage.dataTermino === null
  );
  if (existingVehicleUsage) {
    return res.status(400).json({ error: "Esse veículo já está em uso." });
  }

  const existingDriverUsage = usageData.find(
    usage => usage.motorista.id === motoristaId && usage.dataTermino === null
  );
  if (existingDriverUsage) {
    return res.status(400).json({ error: "Esse motorista já está utilizando outro veículo." });
  }

  const motorista = driverData.find(driver => driver.id === motoristaId);
  const automovel = vehicleData.find(vehicle => vehicle.id === automovelId);

  const newUsage = {
    id: usageData.length + 1,
    dataInicio, 
    motorista,
    automovel,
    motivo,
    dataTermino: null
  };

  usageData.push(newUsage);

  return res.status(201).send(newUsage);
}

export function endUsage(req, res) {
  const { id } = req.params;
  const { dataTermino } = req.body;

  if (!id || !dataTermino) {
    return res.status(400).json({ 
      error: "Motorista inválido! Verifique se os campos id e dataTermino foram preenchidos corretamente."
    });
  }

  const usage = usageData.find(usage => usage.id === Number(id));
  if (!usage) {
    return res.status(404).json({ error: `Utilização de automóvel com id ${id} não encontrado!` });
  }
  if (usage.dataTermino) {
    return res.status(400).json({ error: "Essa utilização já foi encerrada." });
  }

  usage.dataTermino = dataTermino;

  return res.send(usage);
}