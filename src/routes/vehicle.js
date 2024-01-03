import express from "express";
import { 
  getVehicles, 
  createVehicle, 
  getVehicleById, 
  deleteVehicle, 
  updateVehicle 
} from "../controllers/VehicleController.js";

const router = express.Router();

router.get("", getVehicles);
router.get("/:id", getVehicleById);
router.post("", createVehicle);
router.delete("/:id", deleteVehicle);
router.put("/:id", updateVehicle);

export default router;