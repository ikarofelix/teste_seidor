import express from "express";
import { 
  getDrivers, 
  createDriver, 
  getDriverById, 
  deleteDriver, 
  updateDriver 
} from "../controllers/DriverController.js";

const router = express.Router();

router.get("", getDrivers);
router.get("/:id", getDriverById);
router.post("", createDriver);
router.delete("/:id", deleteDriver);
router.put("/:id", updateDriver);

export default router;