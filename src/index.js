import express from "express";
import dotenv from "dotenv";
import vehicleRoute from "./routes/vehicle.js";
import driverRoute from "./routes/driver.js";
import usageRoute from "./routes/usage.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3200;

app.use(express.json());
app.use("/vehicle", vehicleRoute);
app.use("/driver", driverRoute);
app.use("/usage", usageRoute);

const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

export default server;