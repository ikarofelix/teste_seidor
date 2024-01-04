import express from "express";
import { 
  getUsages,
  createUsage,
  endUsage
} from "../controllers/UsageController.js";

const router = express.Router();

router.get("", getUsages);
router.post("", createUsage);
router.put("/:id/end", endUsage);

export default router;